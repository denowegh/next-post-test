import LoginBtn from '@/components/LoginBtn';
import PageTransition from '@/components/PageTransition';
import { FC } from 'react';

type IndexPageProps = {};
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

const HomePage: FC<any> = (props: IndexPageProps, ref: IndexPageRef) => {
	return (
		<PageTransition ref={ref}>
			<div className='d-flex justify-content-center align-items-center'>
				<LoginBtn />
			</div>
		</PageTransition>
	);
};

export default HomePage;
