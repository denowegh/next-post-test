import { signIn, useSession } from 'next-auth/react';
import { Button, Card, Form, Stack } from 'react-bootstrap';
import { ErrorMessage, Field, Form as FormFromik, Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { ToastContent, ToastOptions, toast } from 'react-toastify';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { useEffect } from 'react';

interface User {
	email: string;
	password: string;
}

type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

interface Props {
	dirs: string[];
	ref: IndexPageRef;
}

export default function SignIn({ ref }: Props) {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') router.push('/');
	}, [status]);

	const initialValues: User = {
		email: '',
		password: '',
	};

	const validationSchema = Yup.object({
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
	});

	router.query.error &&
		toast.error(
			'Could not login. Please check your e-mail or password.' as ToastContent<string>,
			{
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: 5000,
				type: 'error',
				toastId: 'ErrorAlert',
			} as ToastOptions
		);

	return (
		<PageTransition ref={ref}>
			<Stack className='mt-5 '>
				<Card className='col-md-5 align-self-center'>
					<Card.Header>
						<Card.Title>Sign In</Card.Title>
					</Card.Header>
					<Card.Body>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={(values, { setSubmitting }) => {
								signIn('credentials', {
									email: values.email,
									password: values.password,
									callbackUrl: '/',
								});
								setSubmitting(false);
							}}
						>
							{({ isValid }) => (
								<FormFromik className='form'>
									<Form.Group className='my-2'>
										<Form.Label htmlFor='email'>Email address</Form.Label>
										<Field
											type='email'
											className='form-control'
											id='email'
											name='email'
										/>
										<Form.Text>
											<ErrorMessage
												name='email'
												component='p'
												className='text-danger'
											/>
										</Form.Text>
									</Form.Group>
									<Form.Group className='my-2 '>
										<Form.Label htmlFor='password' className='form-label'>
											Password
										</Form.Label>
										<Field
											type='password'
											className='form-control'
											id='password'
											name='password'
										/>
										<Form.Text>
											<ErrorMessage
												name='password'
												component={'p'}
												className='text-danger'
											/>
										</Form.Text>
									</Form.Group>
									<Button
										type='submit'
										className='my-2'
										variant='success'
										disabled={!isValid}
									>
										Sign In
									</Button>
								</FormFromik>
							)}
						</Formik>
					</Card.Body>
					<Card.Footer>
						<Stack gap={1}>
							<span className='text-center'>or</span>
							<Button
								variant='success'
								onClick={() => signIn('google', { redirect: false })}
								className='w-50 d-flex align-items-center align-self-center justify-content-center '
							>
								{
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='16'
										height='16'
										fill='currentColor'
										className='bi bi-google mr-2 m-1'
										viewBox='0 0 16 16'
									>
										<path d='M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z' />
									</svg>
								}
								Sign In with Google
							</Button>
							<Stack
								direction='horizontal'
								className='d-flex align-items-center justify-content-center'
							>
								<span>Don't have an account?</span>
								<Link
									type='button'
									className='btn btn-link align-self-center'
									href='/auth/new-user'
								>
									Sign Up
								</Link>
							</Stack>
						</Stack>
					</Card.Footer>
				</Card>
			</Stack>
		</PageTransition>
	);
}
