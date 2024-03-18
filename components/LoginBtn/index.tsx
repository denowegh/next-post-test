import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import style from './LoginBtnStyle.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useSWR from 'swr';
import { DataCreator } from '@/pages/post/[slug]';
import { fetcher } from '@/utilities/fetcher';
import ProfileSVG from '@/public/profile-svgrepo-com.svg';
import { Button } from 'react-bootstrap';

const index: React.FC = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const { data: dataCreator, isLoading: isLoadingCreator } =
		useSWR<DataCreator>(
			`/api/getUserData?email=${session?.user?.email}`,
			fetcher
		);

	if (session) {
		return (
			<>
				<Image
					src={
						dataCreator?.image
							? dataCreator.image
							: dataCreator?.dataImage?.data
							? `data:image/png;base64, ${Buffer.from(
									dataCreator?.dataImage.data
							  ).toString('base64')}`
							: ProfileSVG
					}
					loading='lazy'
					onClick={() => signOut({ redirect: false })}
					alt='Profile Image'
					width={80}
					height={80}
					className={style.loginImage + ' ' + style.pulseButton}
				/>
			</>
		);
	}

	return (
		<>
			<Button
				onClick={() => {
					router.push(`/auth/signin?callbackUrl=/`);
				}}
				type='button'
				variant='success'
			>
				Sign in
			</Button>
		</>
	);
};

export default index;
