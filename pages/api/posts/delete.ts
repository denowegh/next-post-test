import { authOptions } from '@/configs/auth';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!(req.method === 'DELETE'))
		res.status(405).json({ error: 'Method not allowed' });

	const session = await getServerSession(req, res, authOptions);

	if (!session) return res.status(401).json({ message: 'Unauthorized' });

	try {
		const id = req.query.id;

		if (!id) return res.status(400).json({ message: '`id` is missing.' });

		const email = session?.user?.email as string;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(404).json({ message: 'User not found' });

		const post = await prisma.post.findUnique({ where: { id: id as string } });
		if (!post) return res.status(404).json({ message: 'Post not found' });

		if (user?.id !== post?.userId)
			return res.status(403).json({
				message: 'Forbidden: You do not have permission to delete this post',
			});

		await prisma.post.delete({ where: { id: id as string } });

		return res.status(200).json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'A server error has occurred' });
	} finally {
		await prisma.$disconnect();
	}
}
