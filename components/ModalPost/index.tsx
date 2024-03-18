import { SmallPost } from '@/types/model';
import { ErrorMessage, Field, Form as FormikForm, Formik } from 'formik';
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';

interface PostModalProps {
	show: boolean;
	onHide?: () => void;
	post?: SmallPost;
	onSubmitPost?: (post: SmallPost) => void;
}

const index: React.FC<PostModalProps> = ({
	show,
	onHide,
	onSubmitPost,
	post,
}) => {
	const handleAddPost = (values: SmallPost) => {
		const newPost: SmallPost = {
			title: values.title,
			body: values.body,
		};
		if (onSubmitPost) onSubmitPost(newPost);
		if (onHide) onHide();
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.required('Title is required')
			.max(500, 'Title must be at most 500 characters'),
		body: Yup.string()
			.required('Body is required')
			.max(10000, 'Body must be at most 10000 characters'),
	});

	return (
		<Formik
			initialValues={{ title: post?.title || '', body: post?.body || '' }}
			validationSchema={validationSchema}
			onSubmit={(values, { resetForm }) => {
				handleAddPost(values);
				resetForm();
			}}
		>
			{({ errors, touched, isValid }) => (
				<Modal show={show} onHide={onHide}>
					<Modal.Header closeButton>
						<Modal.Title>{post ? 'Update post' : 'Add new post'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormikForm className='form' id='postForm'>
							<Form.Group controlId='title'>
								<Form.Label>Title</Form.Label>
								<Field
									type='text'
									name='title'
									placeholder='Enter title'
									className={`form-control ${
										touched.title && errors.title ? 'is-invalid' : ''
									}`}
								/>
								<ErrorMessage
									component='div'
									name='title'
									className='invalid-feedback'
								/>
							</Form.Group>
							<Form.Group controlId='body'>
								<Form.Label>Body</Form.Label>
								<Field
									as='textarea'
									rows={3}
									name='body'
									placeholder='Enter body'
									className={`form-control ${
										touched.body && errors.body ? 'is-invalid' : ''
									}`}
								/>
								<ErrorMessage
									component='div'
									name='body'
									className='invalid-feedback'
								/>
							</Form.Group>
						</FormikForm>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={onHide}>
							Close
						</Button>
						<Button
							variant='success'
							type='submit'
							form='postForm'
							disabled={!isValid}
						>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</Formik>
	);
};

export default index;
