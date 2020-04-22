import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';

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
				Posted By: {user.first_name || authUser.first_name} {user.last_name || authUser.last_name} on{' '}
				{created_at}
			</p>
		</div>
	);
};

BookDetails.propTypes = {
	book: PropTypes.object.isRequired
};

export default BookDetails;
