export { default } from 'next-auth/middleware';

export const config = {
	matcher: ['/allPosts', '/myPosts', '/post/(.*)'],
};
