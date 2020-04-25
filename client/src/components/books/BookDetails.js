import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import AuthContext from '../../context/auth/authContext';

Moment.globalMoment = moment;
Moment.globalFormat = 'D MMMM YYYY HH:mm';

const BookDetails = ({ book: { title, image, author, category, summary, user, created_at } }) => {
	const authContext = useContext(AuthContext);

	const { user: authUser } = authContext;
	return (
		<div>
			<h1>{title}</h1>
			<img src={image} alt={title} width="300" height="480" />
			<h2>{author}</h2>
			<h3>{category}</h3>
			<p>{summary}</p>
			<p>
				Posted By:{' '}
				<Link to={`/user/${user.id}`}>
					{user.first_name || authUser.first_name} {user.last_name || authUser.last_name}
				</Link>{' '}
				on <Moment>{created_at}</Moment>
			</p>
		</div>
	);
};

BookDetails.propTypes = {
	book: PropTypes.object.isRequired
};

export default BookDetails;
