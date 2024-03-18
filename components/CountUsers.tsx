import React, { FC, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const CountUsers: FC = () => {
	const [usersCount, setUsersCount] = useState(0);

	useEffect((): any => {
		const socket: Socket = io('', {
			path: '/api/users',
		});

		socket.on('usersCount', (count: number) => {
			setUsersCount(count);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return <p className='m-0'>Сonnections: {usersCount}</p>;
};

export default CountUsers;
