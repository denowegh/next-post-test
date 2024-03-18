import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '../../types/next';
import { Server as ServerIO, Socket } from 'socket.io';
import { Server as NetServer } from 'http';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
	if (!res.socket.server.io) {
		console.log('New Socket.io server...');

		const httpServer: NetServer = res.socket.server as any;

		const io = new ServerIO(httpServer, {
			path: '/api/users',
			addTrailingSlash: false,
			pingInterval: 3300,
			pingTimeout: 3000,
		});

		res.socket.server.io = io;

		io.on('connection', socket => {
			console.log('> Client connect');
			io.emit('usersCount', io.engine.clientsCount);

			socket.on('disconnect', () => {
				console.log('> Client disconnect');
				io.emit('usersCount', io.engine.clientsCount);
			});
		});
	}
	res.status(200).end();
};
