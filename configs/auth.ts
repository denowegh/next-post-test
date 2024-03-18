import NextAuth, { NextAuthOptions, PagesOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider, {
	CredentialInput,
} from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Prisma, PrismaClient } from '@prisma/client';
import { Adapter } from 'next-auth/adapters';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma) as Adapter,
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				let user = await prisma.user.findUnique({
					where: {
						email: credentials?.email,
					},
				});
				if (credentials?.email && credentials.password) {
					if (user) {
						const passwordMatches = await bcrypt.compare(
							credentials.password,
							user?.password as string
						);

						if (passwordMatches) {
							return Promise.resolve(user);
						} else {
							return Promise.resolve(null);
						}
					} else {
						return Promise.resolve(null);
					}
				} else {
					return Promise.resolve(null);
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/auth/signin',
		newUser: '/auth/new-user',
		error: '/auth/error',
	},
};
