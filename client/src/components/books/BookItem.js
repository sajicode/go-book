import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import AuthContext from '../../context/auth/authContext';

Moment.globalMoment = moment;
Moment.globalFormat = 'D MMMM YYYY HH:mm';

const BookItem = ({ book }) => {
	const authContext = useContext(AuthContext);
	const { isAuthenticated, user: authUser } = authContext;

	const { id, title, image, author, summary, category, user, created_at } = book;

	return (
		<Fragment>
			{isAuthenticated ? (
				<BookItemStyle>
					<Link to={`/book/${id}`}>
						<BookTitle>{title}</BookTitle>
						<img src={image} alt={title} width="300" height="480" />
					</Link>
					<h2>{author}</h2>
					<h3>{category}</h3>
					<BookSummary>{summary.slice(0, 150)}...</BookSummary>
					<p>
						Posted By:{' '}
						<Link to={`/user/${user.id}`}>
							<Poster>
								{user.first_name || authUser.first_name} {user.last_name || authUser.last_name}
						</Poster>
						</Link>{' '}
						on <Moment>{created_at}</Moment>
					</p>
				</BookItemStyle>
			) : (
				<BookItemStyle>
					<BookTitle>{title}</BookTitle>
					<img src={image} alt={title} width="300" height="480" />
					<h2>{author}</h2>
					<h3>{category}</h3>
					<BookSummary>{summary.slice(0, 150)}...</BookSummary>
					<p>
							Posted By: <Poster>
								{user.first_name || authUser.first_name} {user.last_name || authUser.last_name}
						</Poster> on{' '}
						<Moment>{created_at}</Moment>
					</p>
				</BookItemStyle>
			)}
		</Fragment>
	);
};

BookItem.propTypes = {
	book: PropTypes.object.isRequired
};

const BookTitle = styled.h1`
	text-align: center;
	color: #eeba6d;
	margin-bottom: 1rem;
`;

const BookItemStyle = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;

	& > * {
		padding: 1rem 0;
	}
`;

const BookSummary = styled.p`
	font-size: 1.2rem;
	color: #fff;
	padding: 0 2rem;
`;

const Poster = styled.span`
	color: #eeba6d;

	&:hover {
		color: #fff;
	}
`;

export default BookItem;
