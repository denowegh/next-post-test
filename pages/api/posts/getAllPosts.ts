import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!(req.method === 'GET'))
		res.status(405).json({ error: 'Method not allowed' });
	try {
		const { page = 1, pageSize = 10 } = req.query;

		const pageNumber = parseInt(page as string);
		const pageSizeNumber = parseInt(pageSize as string);

		if (Number.isNaN(pageNumber) && Number.isNaN(pageSizeNumber))
			return res
				.status(400)
				.json({ message: '`pageNumber` or `pageSizeNumber` incorrect.' });

		const countPosts = await prisma.post.count();

		const totalPages = Math.ceil(countPosts / pageSizeNumber);

		const posts = await prisma.post.findMany({
			take: pageSizeNumber,
			where: {},
			skip: (pageNumber - 1) * pageSizeNumber,
		});

		return res.status(200).json({ posts, totalPages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
