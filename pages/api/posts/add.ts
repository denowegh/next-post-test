import { authOptions } from '@/configs/auth';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!(req.method === 'POST'))
		res.status(405).json({ error: 'Method not allowed' });

	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ message: 'Unauthorized' });

	try {
		const { title, body } = req.body;

		if (!title || !body)
			return res.status(400).json({ message: '`title` or `body` is missing.' });

		const email = session?.user?.email as string;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(404).json({ message: 'User not found' });

		const newPost = await prisma.post.create({
			data: {
				body,
				title,
				userId: user.id,
			},
		});

		return res
			.status(201)
			.json({ message: 'Post created successfully', post: newPost });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
