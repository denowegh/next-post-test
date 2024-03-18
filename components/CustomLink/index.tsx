import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import style from './CustomLinkStyle.module.css';

interface CustomLinkProps {
	pathname: string;
	content: string;
}

const index: FC<CustomLinkProps> = ({ pathname, content }) => {
	const router = useRouter();

	const isActive = (pathname: string) => {
		return router.pathname === pathname ? `${style.linkActive} ` : ' ';
	};

	return (
		<Link
			href={`${pathname}`}
			className={`${style.link} user-select-none  ${isActive(pathname)}`}
		>
			<b>{content}</b>
		</Link>
	);
};

export default index;
