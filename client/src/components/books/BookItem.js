import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
				<div>
					<Link to={`/book/${id}`}>
						<h1>{title}</h1>
						<img src={image} alt={title} width="300" height="480" />
					</Link>
					<h2>{author}</h2>
					<h3>{category}</h3>
					<p>{summary}</p>
					<p>
						Posted By:{' '}
						<Link to={`/user/${id}`}>
							{user.first_name || authUser.first_name} {user.last_name || authUser.last_name}
						</Link>{' '}
						on <Moment>{created_at}</Moment>
					</p>
				</div>
			) : (
				<div>
					<h1>{title}</h1>
					<img src={image} alt={title} width="300" height="480" />
					<h2>{author}</h2>
					<h3>{category}</h3>
					<p>{summary}</p>
					<p>
						Posted By: {user.first_name || authUser.first_name} {user.last_name || authUser.last_name} on{' '}
						<Moment>{created_at}</Moment>
					</p>
				</div>
			)}
		</Fragment>
	);
};

BookItem.propTypes = {
	book: PropTypes.object.isRequired
};

export default BookItem;
