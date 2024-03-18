import ModalPost from '@/components/ModalPost';
import PageTransition from '@/components/PageTransition';
import PostLinkCard from '@/components/PostLinkCard';
import { SmallPost } from '@/types/model';
import { fetcher } from '@/utilities/fetcher';
import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	Container,
	ListGroup,
	Row,
	Spinner,
	Stack,
} from 'react-bootstrap';
import { ToastContent, ToastOptions, toast } from 'react-toastify';
import useSWRInfinite from 'swr/infinite';

interface ServerData {
	posts: SmallPost[];
	totalPages: number;
	massage?: string;
}

const isElementNearViewport = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	return rect.top <= window.innerHeight * 2;
};

type ProductsPageRef = React.ForwardedRef<HTMLDivElement>;

const index = (ref: ProductsPageRef) => {
	const sentinelRef = useRef(null);
	const [showModal, setShowModal] = useState(false);

	const getKey = (pageIndex: number, previousPageData: ServerData | null) => {
		if (previousPageData && !previousPageData.posts.length) return null;

		return `/api/posts/userPosts?page=${pageIndex + 1}&pageSize=8`;
	};

	const { data, error, size, setSize, mutate } = useSWRInfinite<ServerData>(
		getKey,
		fetcher
	);
	const isLoadingInitialData = !data && !error;

	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === 'undefined');

	const isEmpty = data?.[0].posts.length === 0;
	useEffect(() => {
		console.log(data);
	}, [data]);

	const isReachingEnd = isEmpty || (data && data[0].totalPages <= size);

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

	const addPostHandler = async (newPost: SmallPost) => {
		const response = await fetch('/api/posts/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: newPost.title, body: newPost.body }),
		});

		if (!response.ok) {
			toast.error(
				`Error creating post: ${
					(await response.json()).message
				}` as ToastContent<string>,
				{
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 5000,
					type: 'error',
					toastId: 'ErrorAlert',
				} as ToastOptions
			);
		} else {
			mutate();
			toast.success(
				`Post created: ${
					(await response.json()).message
				}` as ToastContent<string>,
				{
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 5000,
					type: 'success',
					toastId: 'SuccessAlert',
				} as ToastOptions
			);
		}
	};

	return (
		<PageTransition ref={ref}>
			<Container className='p-3'>
				<Row>
					<Stack direction='horizontal' gap={2}>
						<h3>My posts</h3>
						<Button variant='success' onClick={() => setShowModal(true)}>
							Add post
						</Button>
					</Stack>
				</Row>
				<Row className='d-flex align-items-center justify-content-center'>
					<ModalPost
						show={showModal}
						onHide={() => setShowModal(false)}
						onSubmitPost={addPostHandler}
					/>
					{isEmpty ? (
						<h6 className='text-center'>Posts not found</h6>
					) : (
						<>
							<ListGroup variant='flush'>
								{data?.map(pageData =>
									pageData.posts.map((post, i) => (
										<ListGroup.Item key={i}>
											<PostLinkCard post={post} />
										</ListGroup.Item>
									))
								)}
							</ListGroup>
							<div ref={sentinelRef} style={{ height: '1px' }}></div>
							{isLoadingMore && (
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

export default index;
