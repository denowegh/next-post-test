import PageTransition from '@/components/PageTransition';
import PostLinkCard from '@/components/PostLinkCard';
import { fetcher } from '@/utilities/fetcher';
import { Post } from '@prisma/client';
import React, { use, useEffect, useRef } from 'react';
import { Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import useSWRInfinite from 'swr/infinite';

interface ServerData {
	posts: Post[];
	totalPages: number;
	message?: string;
}

const isElementNearViewport = (el: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	return rect.top <= window.innerHeight * 2;
};

const Index = () => {
	const sentinelRef = useRef<HTMLDivElement>(null);

	const getKey = (pageIndex: number, previousPageData: ServerData | null) => {
		if (previousPageData && !previousPageData.posts.length) return null;

		return `/api/posts/getAllPosts?page=${pageIndex + 1}&pageSize=8`;
	};

	const { data, error, size, setSize, mutate } = useSWRInfinite<ServerData>(
		getKey,
		fetcher
	);

	const isLoadingInitialData = !data && !error;

	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === 'undefined');

	const isEmpty = data?.[0]?.posts.length === 0;

	const isReachingEnd =
		isEmpty || (data && data[data.length - 1]?.posts.length < 8);

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
		<PageTransition>
			<Container className='p-3'>
				<Row>
					<h3 className='text-center'>All posts</h3>
				</Row>
				<Row className='d-flex align-items-center justify-content-center'>
					{isEmpty ? (
						<h6 className='text-center'>Posts not found</h6>
					) : (
						<>
							<ListGroup variant='flush'>
								{data &&
									data.map((pageData, i) =>
										pageData.posts.map(post => (
											<ListGroup.Item key={post.id}>
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

export default Index;
