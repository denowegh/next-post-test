import { authOptions } from '@/configs/auth';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse, NextConfig } from 'next';
import { getServerSession } from 'next-auth';

export const config = {
	api: {
		responseLimit: '500mb',
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!(req.method === 'GET'))
		res.status(405).json({ error: 'Method not allowed' });

	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ message: 'Unauthorized' });

	try {
		const id = req.query.id;
		const email = req.query.email;

		if (!id && !email)
			return res.status(400).json({ message: '`id` or `email` is missing.' });

		let user;

		if (email) {
			user = await prisma.user.findUnique({
				where: { email: email as string },
			});
		} else {
			user = await prisma.user.findUnique({ where: { id: id as string } });
		}

		if (!user) return res.status(404).json({ message: 'User not found' });

		return res
			.status(200)
			.json({ name: user.name, dataImage: user.dataImage, image: user.image });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
