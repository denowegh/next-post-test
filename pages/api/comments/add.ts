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
		const postId = req.query.postId;
		const { body } = req.body;

		if (!postId || !body)
			return res
				.status(400)
				.json({ message: '`postId` or `body` is missing.' });

		const name = session?.user?.name as string;
		const email = session?.user?.email as string;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(404).json({ message: 'User not found' });

		const comment = await prisma.comment.create({
			data: {
				body,
				userEmail: user.email as string,
				name,
				postId: postId as string,
			},
		});

		return res
			.status(201)
			.json({ message: 'Comment created successfully', comment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
