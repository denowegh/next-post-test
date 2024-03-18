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
		const email = session?.user?.email as string;
		const { page = 1, pageSize = 10 } = req.query;

		const pageNumber = parseInt(page as string);
		const pageSizeNumber = parseInt(pageSize as string);

		if (Number.isNaN(pageNumber) && Number.isNaN(pageSizeNumber))
			return res
				.status(400)
				.json({ message: '`pageNumber` or `pageSizeNumber` incorrect.' });

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(404).json({ message: 'User not found!' });

		const countPosts = await prisma.post.findMany({
			where: { userId: user.id },
		});

		const totalPages = Math.ceil(countPosts.length / pageSizeNumber);

		const posts = await prisma.post.findMany({
			where: { userId: user.id },
			take: pageSizeNumber,
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
