import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth/core/types';
import { ToastContainer } from 'react-toastify';
import SSRProvider from 'react-bootstrap/SSRProvider';
import 'moment/locale/ru';
import CustomNavBar from '@/components/CustomNavBar';

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
	const router = useRouter();
	const pageKey = router.pathname;

	return (
		<SessionProvider session={pageProps.session}>
			<SSRProvider>
				<CustomNavBar />{' '}
				<AnimatePresence mode='wait'>
					<Component {...pageProps} key={pageKey} />
				</AnimatePresence>
				<ToastContainer />
			</SSRProvider>
		</SessionProvider>
	);
}
export default App;
