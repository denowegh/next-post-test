import React, { useEffect } from 'react';
import style from './style.module.css';
import Link from 'next/link';
import { Card, Stack } from 'react-bootstrap';
import { SmallPost } from '@/types/model';
import { fetcher } from '@/utilities/fetcher';
import { DataCreator } from '@/pages/post/[slug]';
import useSWR from 'swr';
import Image from 'next/image';
import ProfileSVG from '@/public/profile-svgrepo-com.svg';
import { useRouter } from 'next/router';

interface Props {
	post: SmallPost;
}

const index = ({ post }: Props) => {
	const router = useRouter();
	const { data: dataCreator, isLoading: isLoadingCreator } =
		useSWR<DataCreator>(`/api/getUserData?id=${post.userId}`, fetcher);

	return (
		<Link
			href={`/post/${post.id}`}
			locale={router.locale}
			className={`text-decoration-none text-reset ${style.postLink}`}
		>
			<Card>
				<Card.Header>
					<h2>{post.title}</h2>
					<Stack direction='horizontal' gap={2}>
						<Image
							className='rounded'
							alt='Image'
							width={25}
							height={25}
							src={
								dataCreator?.image
									? dataCreator.image
									: dataCreator?.dataImage?.data
									? `data:image/png;base64, ${Buffer.from(
											dataCreator?.dataImage.data
									  ).toString('base64')}`
									: ProfileSVG
							}
						/>
						<Card.Text>{dataCreator?.name}</Card.Text>
					</Stack>
				</Card.Header>
				<Card.Body>
					<Card.Text className='text-truncate'>{post.body}</Card.Text>
				</Card.Body>
			</Card>
		</Link>
	);
};

export default index;
