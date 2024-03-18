import PageTransition from '@/components/PageTransition';
import { Post } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	Container,
	Form,
	InputGroup,
	ListGroup,
	Row,
	Spinner,
} from 'react-bootstrap';
import { ToastContent, ToastOptions, toast } from 'react-toastify';
import CommentCard from '@/components/CommentCard';
import { SmallComment } from '@/types/model';
import { useSession } from 'next-auth/react';
import CardPost from '@/components/CardPost';
import useSWR from 'swr';
import { fetcher } from '@/utilities/fetcher';
import useSWRInfinite from 'swr/infinite';
import { Buffer } from 'buffer';
import { useRouter } from 'next/router';

export interface DataPost {
	post?: Post;
}

export interface DataComments {
	comments: SmallComment[];
	totalPages: number;
}

export interface DataCreator {
	name: string;
	image: string;
	dataImage?: {
		data: Buffer;
	};
}

export interface DataCountComments {
	countComments: number;
}

type ProductsPageRef = React.ForwardedRef<HTMLDivElement>;

const isElementNearViewport = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	return rect.top <= window.innerHeight * 2;
};

const Index = (ref: ProductsPageRef) => {
	const router = useRouter();
	const postId = router.query.slug as string;
	const { data: session, status } = useSession();
	const sentinelRef = useRef(null);
	const [comment, setComment] = useState('');

	const getKeyComment = (
		pageIndex: number,
		previousPageData: DataComments | null
	) => {
		if (previousPageData && !previousPageData.comments.length) return null;

		return postId
			? `/api/comments/allFromPost?id=${postId}&page=${
					pageIndex + 1
			  }&pageSize=8`
			: null;
	};

	const {
		data: dataPost,
		error: postError,
		mutate: mutatePost,
		isLoading: isLoadingPost,
	} = useSWR<DataPost>(
		postId ? `/api/posts/getPost?id=${postId}` : null,
		fetcher
	);

	const { data: dataCountComments, mutate: mutateCountComments } =
		useSWR<DataCountComments>(
			postId ? `/api/comments/count?id=${postId}` : null,
			fetcher
		);

	const {
		data: dataCreator,
		error: creatorError,
		mutate: mutateCreator,
		isLoading: isLoadingCreator,
	} = useSWR<DataCreator>(
		dataPost?.post?.userId
			? `/api/getUserData?id=${dataPost?.post?.userId}`
			: null,
		fetcher
	);

	const {
		data: dataComments,
		error: commentsError,
		size,
		setSize,
		mutate: mutateComment,
		isLoading: isLoadingCommnets,
	} = useSWRInfinite<DataComments>(getKeyComment, fetcher);

	const handleAddComment = async () => {
		if (session?.user && dataPost?.post?.id && comment) {
			try {
				const response = await fetch(
					`/api/comments/add?postId=${dataPost.post.id}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ body: comment }),
					}
				);

				if (response.ok) {
					mutateComment();
					mutateCountComments();
				} else {
					throw new Error(
						'Failed to add comment ' + (await response.json()).message
					);
				}
			} catch (error) {
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
		} else {
			console.error(
				'Missing required fields: session.user, data.post.id, or comment'
			);
		}

		setComment('');
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value);
	};

	const handleDeleteComment = async (id?: string) => {
		try {
			const response = await fetch(`/api/comments/delete?id=${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				mutateComment();
				mutateCountComments();
				toast.success(
					`Comment successfully deleted ` as ToastContent<string>,
					{
						position: toast.POSITION.BOTTOM_RIGHT,
						autoClose: 1000,
						type: 'success',
						toastId: 'SuccessAlert',
					} as ToastOptions
				);
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

	let isLoadingInitialComments = !dataComments && !commentsError;

	let isLoadingMore =
		isLoadingInitialComments ||
		(size > 0 && dataComments && typeof dataComments[size - 1] === 'undefined');

	let isEmpty = dataComments?.[0]?.comments?.length == 0;

	let isReachingEnd =
		isEmpty || (dataComments && dataComments[0].totalPages <= size);

	useEffect(() => {
		const handleScroll = () => {
			if (
				!isLoadingMore &&
				sentinelRef?.current &&
				isElementNearViewport(sentinelRef?.current) &&
				!isReachingEnd
			) {
				setSize(s => s + 1);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isLoadingMore, isReachingEnd]);

	return (
		<PageTransition ref={ref}>
			<Container className='p-3'>
				<Row>
					<CardPost creator={dataCreator} post={dataPost?.post} />
				</Row>
				<Row className='d-flex align-items-center justify-content-center'>
					<InputGroup className='m-3'>
						<Form.Control
							placeholder='Add comment'
							aria-label='Add comment'
							aria-describedby='add-comment'
							value={comment}
							onChange={handleChange}
						/>
						<Button
							variant='outline-success'
							id='button-add-comment'
							onClick={handleAddComment}
						>
							Comment
						</Button>
					</InputGroup>
					<h5>{dataCountComments?.countComments || 0} Comments</h5>
					{isEmpty ? (
						<h6 className='text-center'>There are no comments</h6>
					) : (
						<>
							<ListGroup variant='flush'>
								{dataComments?.map(
									pageData =>
										pageData.comments &&
										pageData.comments.map((comment, i) => (
											<ListGroup.Item key={i}>
												<CommentCard
													comment={comment}
													onClickDelete={() => handleDeleteComment(comment.id)}
												/>
											</ListGroup.Item>
										))
								)}
							</ListGroup>
							<div ref={sentinelRef} style={{ height: '1px' }}></div>
							{isLoadingCommnets && (
								<Spinner animation='border' role='status' className='mt-3'>
									<span className='visually-hidden'>Loading...</span>
								</Spinner>
							)}
						</>
					)}
				</Row>
			</Container>
		</PageTransition>
	);
};

export default Index;
