/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin');
module.exports = {
	trailingSlash: true,
	images: {
		domains: ['localhost:3000'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};
