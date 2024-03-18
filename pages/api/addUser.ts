import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import formidable from 'formidable';
import fs from 'fs';
import type IncomingForm from 'formidable/Formidable';
import path from 'path';
import { allowedImageTypes } from '@/constants';
import { prisma } from '../../lib/prisma';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const form: IncomingForm = formidable({});

		form.parse(
			req,
			async function (
				err,
				fields: formidable.Fields<string>,
				files: formidable.Files<string>
			) {
				try {
					if (err) {
						console.error(err);
						throw err;
					}

					if (files?.file && fields) {
						const uploadedFile = files.file[0];

						const typeFile: string = uploadedFile.originalFilename
							?.split('.')
							.pop() as string;

						if (allowedImageTypes.includes(typeFile)) {
							const imageData = fs.readFileSync(uploadedFile.filepath);
							const name: string = (fields?.name as string[])[0];
							const email: string = (fields?.email as string[])[0];
							const password: string = (fields?.password as string[])[0];

							const passwordHash = await bcrypt.hash(password, 10);
							let user = await prisma.user.create({
								data: {
									name,
									email,
									emailVerified: new Date(),
									dataImage: imageData,
									password: passwordHash,
								},
							});

							res
								.status(201)
								.json({ message: 'User created successfully', user });
						} else {
							res.status(400).json({ message: 'Wrong image type' });
						}
					} else {
						res.status(400).json({ message: 'File upload is required' });
					}
				} catch (error) {
					if (
						error instanceof Prisma.PrismaClientKnownRequestError &&
						error.code === 'P2002'
					) {
						res.status(400).json({ error: 'Email is already registered' });
					} else {
						console.error('Error creating user:', error);
						res
							.status(500)
							.json({ error: 'An error occurred while creating the user' });
					}
				}
			}
		);
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
