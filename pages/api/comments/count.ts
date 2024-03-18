import { authOptions } from '@/configs/auth';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

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
		if (!id) return res.status(400).json({ message: '`id` is missing.' });

		const countComments = await prisma.comment.findMany({
			where: { postId: id as string },
		});
		return res.status(200).json({ countComments: countComments.length });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
