import React, { useEffect, useState } from 'react';
import { Button, Card, Stack } from 'react-bootstrap';
import Image from 'next/image';
import trash from '@/public/trash.svg';
import pencil from '@/public/pencil.svg';
import ProfileSVG from '@/public/profile-svgrepo-com.svg';
import { SmallPost } from '@/types/model';
import { ToastContent, ToastOptions, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import ModalPost from '../ModalPost';
import { DataCreator } from '@/pages/post/[slug]';

type Props = {
	creator?: DataCreator;
	post?: SmallPost;
};

function index({ creator, post }: Props) {
	const [isUserCreatePost, setIsUserCreatePost] = useState(false);
	const [localPost, setLocalPost] = useState<SmallPost | undefined>();
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		if (post?.id)
			fetch(`/api/posts/isUserCreatePost?id=${post?.id}`)
				.then(v => v.json())
				.then(v => setIsUserCreatePost(v.userCreatePost));
	}, [creator]);

	useEffect(() => {
		setLocalPost(post);
	}, [post]);

	const handleDeletePost = async (id?: string) => {
		try {
			const response = await fetch(`/api/posts/delete?id=${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				router.push('/myPosts');
			} else {
				throw new Error((await response.json()).message);
			}
		} catch (error) {
			console.error(error);
			toast.error(
				`${error}` as ToastContent<string>,
				{
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 5000,
					type: 'error',
					toastId: 'ErrorAlert',
				} as ToastOptions
			);
		}
	};
	const updatePostHandle = async (newPost: SmallPost) => {
		try {
			const response = await fetch(`/api/posts/update?id=${post?.id}`, {
				method: 'PUT',
				body: JSON.stringify({
					body: newPost.body,
					title: newPost.title,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				throw new Error((await response.json()).message);
			} else {
				setLocalPost((await response.json()).post);
			}
		} catch (error) {
			console.error(error);
			toast.error(
				`${error}` as ToastContent<string>,
				{
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 5000,
					type: 'error',
					toastId: 'ErrorAlert',
				} as ToastOptions
			);
		}
	};
	return (
		<Card className='p-0'>
			<ModalPost
				show={showModal}
				onHide={() => setShowModal(false)}
				onSubmitPost={updatePostHandle}
				post={localPost}
			/>
			<Card.Header>
				<Card.Title>
					<Stack direction='horizontal' className='justify-content-between'>
						<h3>{localPost?.title}</h3>
						{isUserCreatePost && (
							<Stack direction='horizontal' gap={3}>
								<Button className='child' onClick={() => setShowModal(true)}>
									<Image src={pencil} alt='Trash' />
								</Button>
								<Button
									variant='danger'
									className='child'
									onClick={e => handleDeletePost(localPost?.id)}
								>
									<Image src={trash} alt='Trash' />
								</Button>
							</Stack>
						)}
					</Stack>
				</Card.Title>
				<Stack direction='horizontal' gap={2}>
					<Image
						className='rounded'
						alt='Image'
						width={25}
						height={25}
						src={
							creator?.image
								? creator.image
								: creator?.dataImage?.data
								? `data:image/png;base64, ${Buffer.from(
										creator?.dataImage.data
								  ).toString('base64')}`
								: ProfileSVG
						}
					/>
					<Card.Text>{creator?.name}</Card.Text>
				</Stack>
			</Card.Header>
			<Card.Body>
				<Card.Text>{localPost?.body}</Card.Text>
			</Card.Body>
		</Card>
	);
}

export default index;
