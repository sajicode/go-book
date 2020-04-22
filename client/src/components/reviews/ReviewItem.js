import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';

const ReviewItem = ({ review }) => {
	const authContext = useContext(AuthContext);

	const { user: authUser } = authContext;
	const { notes, created_at, user } = review;
	return (
		<div>
			<h3>{notes}</h3>
			<p>
				By {user.first_name || authUser.first_name} {user.last_name || authUser.last_name} on {created_at}
			</p>
		</div>
	);
};

ReviewItem.propTypes = {
	review: PropTypes.object.isRequired
};

export default ReviewItem;
