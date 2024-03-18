import React, { FC } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
	Container,
	ListGroup,
	Navbar,
	Offcanvas,
	Stack,
} from 'react-bootstrap';
import CustomLink from '../CustomLink';
import LoginBtn from '../LoginBtn';
import { navigationType } from '@/types/next';
import Logo from '../Logo';

const DateAndCountUsers = dynamic(() => import('../DateAndCountUsers'), {
	ssr: false,
});

const index: FC = () => {
	const router = useRouter();
	const locale = 'ua';
	const navigation: Array<navigationType> = [
		{ id: 1, title: 'All posts', path: '/allPosts' },
		{ id: 2, title: 'My posts', path: '/myPosts' },
	];

	return (
		<Navbar
			expand={false}
			sticky='top'
			bg='light'
			className=' mb-3 d-flex justify-content-around shadow-lg'
		>
			<Container fluid={true}>
				<Navbar.Offcanvas placement='start' style={{ width: '250px' }}>
					<Offcanvas.Header closeButton>
						<Logo />
					</Offcanvas.Header>
					<Offcanvas.Body>
						<ListGroup className='nav nav-pills flex-column justify-content-center align-items-center mb-sm-auto '>
							<li key={0} className='nav-item'>
								<LoginBtn />
							</li>
							{navigation.map(e => {
								return (
									<li key={e.id} className=' m-2 '>
										<CustomLink pathname={`${e.path}`} content={e.title} />
									</li>
								);
							})}
						</ListGroup>
					</Offcanvas.Body>
				</Navbar.Offcanvas>
				<Navbar.Brand className='m-0 mx-3'>
					<Stack gap={3} direction='horizontal'>
						<Navbar.Toggle />
						<Logo />
					</Stack>
				</Navbar.Brand>
				<Navbar.Text className='p-0 '>
					<DateAndCountUsers />
				</Navbar.Text>
			</Container>
		</Navbar>
	);
};

export default index;
