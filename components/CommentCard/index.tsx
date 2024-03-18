import { SmallComment } from '@/types/model';
import React from 'react';
import { Button, Card, Stack } from 'react-bootstrap';
import trash from '@/public/trash.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

type Props = {
	comment: SmallComment;
	onClickDelete?: React.MouseEventHandler<HTMLButtonElement>;
};

function index({ comment, onClickDelete }: Props) {
	const { data: session, status } = useSession();
	return (
		<Card>
			<Card.Header>
				<Stack
					direction='horizontal'
					className='d-flex justify-content-between'
				>
					<Card.Title>{comment.name}</Card.Title>
					{session?.user?.email === comment.userEmail && (
						<Button variant='danger' onClick={onClickDelete}>
							<Image src={trash} alt='trash'></Image>
						</Button>
					)}
				</Stack>
			</Card.Header>
			<Card.Body>
				<Card.Text>{comment.body}</Card.Text>
			</Card.Body>
		</Card>
	);
}

export default index;
