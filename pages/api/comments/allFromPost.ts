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
		const { page = 1, pageSize = 10 } = req.query;

		if (!id) return res.status(400).json({ message: '`id` is missing.' });

		const pageNumber = parseInt(page as string);
		const pageSizeNumber = parseInt(pageSize as string);

		if (Number.isNaN(pageNumber) && Number.isNaN(pageSizeNumber))
			return res
				.status(400)
				.json({ message: '`pageNumber` or `pageSizeNumber` incorrect.' });

		const countComments = await prisma.comment.findMany({
			where: { postId: id as string },
		});

		const totalPages = Math.ceil(countComments.length / pageSizeNumber);

		const comments = await prisma.comment.findMany({
			where: { postId: id as string },
			take: pageSizeNumber,
			skip: (pageNumber - 1) * pageSizeNumber,
		});

		return res.status(200).json({ comments, totalPages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
