import React, { FC, useState } from 'react';
import moment from 'moment';
import CountUsers from './CountUsers';
import Moment from 'react-moment';
import { Stack } from 'react-bootstrap';

export interface Language {
	code: string;
	title: string;
}

const DateAndCountUsers: FC = () => {
	const [currentDate, setCurrentDate] = useState(moment());

	setInterval(() => {
		setCurrentDate(moment());
	}, 1000);

	return (
		<Stack className='m-0 mx-3 d-inline-flex'>
			<Stack direction='horizontal' gap={3}>
				<b>Today</b>{' '}
			</Stack>
			<Stack className=' mt-2' direction='horizontal'>
				<Moment format='DD MMM YYYY' date={currentDate} />
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='30'
					height='16'
					fill='currentColor'
					className='bi bi-clock m-1 text-success'
					viewBox='0 0 16 16'
				>
					<path d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z' />
					<path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z' />
				</svg>

				<Moment format='HH:mm' date={currentDate} />
			</Stack>
			<CountUsers />
		</Stack>
	);
};

export default DateAndCountUsers;
