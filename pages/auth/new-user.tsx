import { MAX_FILE_SIZE, allowedImageTypes } from '@/constants';
import { ErrorMessage, Field, Formik, FormikHelpers } from 'formik';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { ToastContent, ToastOptions, toast } from 'react-toastify';
import { SignInOptions, signIn, useSession } from 'next-auth/react';
import PageTransition from '@/components/PageTransition';
import { Button, Card, Form, Stack } from 'react-bootstrap';
import { useRouter } from 'next/router';

export interface NewUserType {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	image: File | null;
}
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

interface Props {
	ref: IndexPageRef;
}

const newUser: NextPage<Props> = ({ ref }) => {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') router.push('/');
	}, [status]);

	const initialValues: NewUserType = {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		image: null,
	};

	function isValidImgFileType(fileName: string | undefined): boolean {
		return (
			fileName !== undefined &&
			allowedImageTypes.indexOf(fileName.split('.').pop()!) > -1
		);
	}

	const validationSchema = Yup.object({
		name: Yup.string().max(50).required('Required'),
		email: Yup.string()
			.email('Invalid email address')
			.max(50)
			.required('Required'),
		password: Yup.string()
			.required('Required')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
				'Password must contain at least 8 characters, one letter, one number, and one special character'
			),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password')], 'Passwords must match')
			.required('Required'),
		image: Yup.mixed()
			.required('Required')
			.test('is-valid-size', `Max size image ${MAX_FILE_SIZE}`, value => {
				if (value instanceof File) {
					const size = value.size / 1024;
					return MAX_FILE_SIZE > size;
				}
				return true;
			})
			.test('is-valid-type', 'Not a valid image type', value =>
				isValidImgFileType(value && (value as File).name.toLowerCase())
			),
	});

	const HandleSubmit = async (
		values: NewUserType,
		formikHelpers: FormikHelpers<NewUserType>
	) => {
		if (!values.image) return;

		const data = new FormData();
		data.append('name', values.name);
		data.append('file', values.image);
		data.append('email', values.email);
		data.append('password', values.password);

		const res = await fetch('/api/addUser', {
			method: 'POST',
			body: data,
		});

		if (!res.ok) {
			toast.error(
				`Failed to register. Please check your email address, password or profile picture. Error: ${
					(await res.json()).message
				}` as ToastContent<string>,
				{
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 5000,
					type: 'error',
					toastId: 'ErrorAlert',
				} as ToastOptions
			);
		} else {
			signIn('credentials', {
				email: values.email,
				password: values.password,
				callbackUrl: '/',
			} as SignInOptions);
		}
	};

	return (
		<PageTransition ref={ref}>
			<Stack className='mt-5'>
				<Card className='col-md-5 align-self-center'>
					<Card.Header>
						<Card.Title>Sign Up</Card.Title>
					</Card.Header>
					<Card.Body>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={HandleSubmit}
						>
							{({ isValid, setFieldValue, errors, handleSubmit }) => (
								<Form onSubmit={handleSubmit}>
									<Form.Group className='mb-2'>
										<Form.Label htmlFor='name' className='form-label'>
											Name
										</Form.Label>
										<Field
											type='text'
											className='form-control'
											id='name'
											name='name'
										/>
										<ErrorMessage name='name'>
											{msg => (
												<Form.Text className='text-danger'>{msg}</Form.Text>
											)}
										</ErrorMessage>
									</Form.Group>
									<Form.Group className='mb-2'>
										<Form.Label htmlFor='email'>Email address</Form.Label>
										<Field
											type='email'
											className='form-control'
											id='email'
											name='email'
										/>
										<ErrorMessage name='email'>
											{msg => (
												<Form.Text className='text-danger'>{msg}</Form.Text>
											)}
										</ErrorMessage>
									</Form.Group>
									<Form.Group className='mb-2'>
										<Form.Label htmlFor='password'>Password</Form.Label>
										<Field
											type='password'
											className='form-control'
											id='password'
											name='password'
										/>
										<ErrorMessage name='password'>
											{msg => (
												<Form.Text className='text-danger'>{msg}</Form.Text>
											)}
										</ErrorMessage>
									</Form.Group>
									<Form.Group className='mb-2'>
										<Form.Label htmlFor='confirmPassword'>
											Confirm password
										</Form.Label>
										<Field
											type='password'
											className='form-control'
											id='confirmPassword'
											name='confirmPassword'
										/>
										<ErrorMessage name='confirmPassword'>
											{msg => (
												<Form.Text className='text-danger'>{msg}</Form.Text>
											)}
										</ErrorMessage>
									</Form.Group>
									<Form.Group className='mb-2'>
										<Form.Label htmlFor='image'>Profile picture</Form.Label>
										<input
											type='file'
											className='form-control'
											id='image'
											name='image'
											accept='.jpg, .jpeg, .png, .gif'
											onChange={e => {
												if (e.currentTarget.files) {
													setFieldValue('image', e.currentTarget.files[0]);
												}
											}}
										/>
										{errors.image && (
											<Form.Text className='text-danger'>
												{errors.image}
											</Form.Text>
										)}
									</Form.Group>

									<Button type='submit' variant='success' disabled={!isValid}>
										Sign Up
									</Button>
								</Form>
							)}
						</Formik>
					</Card.Body>
				</Card>
			</Stack>
		</PageTransition>
	);
};

export default newUser;
