import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import reactSvg from '@/public/react-2.svg';
import { useRouter } from 'next/router';

const index = () => {
	const router = useRouter();
	const isActive = (pathname: string) => {
		return router.pathname === pathname ? 'active' : '';
	};
	return (
		<Link href={`/`} className={`nav-link ${isActive(`/`)}`}>
			<Image alt='Logo' width={50} height={50} src={reactSvg} />
			{'  '}PostsApp
		</Link>
	);
};

export default index;
