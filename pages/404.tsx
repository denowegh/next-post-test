import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import PageTransition from '@/components/PageTransition';

type IndexPageRef = React.ForwardedRef<HTMLDivElement>;
const Custom404 = (ref: IndexPageRef) => {
	return (
		<PageTransition ref={ref}>
			<Container>
				<Row>
					<Col>
						<h1 className='display-4'>404 - Page Not Found</h1>
						<p className='lead'>
							Sorry, the page you requested could not be found.
						</p>
						<p>Please return to the homepage:</p>
						<Link href='/' className='btn btn-primary btn-success'>
							Go to Homepage
						</Link>
					</Col>
				</Row>
			</Container>
		</PageTransition>
	);
};

export default Custom404;
