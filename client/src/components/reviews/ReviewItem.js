import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import AuthContext from '../../context/auth/authContext';

Moment.globalMoment = moment;
Moment.globalFormat = 'D MMMM YYYY HH:mm';

const ReviewItem = ({ review }) => {
	const authContext = useContext(AuthContext);

	const { user: authUser } = authContext;
	const { notes, created_at, user } = review;
	return (
		<div>
			<h3>{notes}</h3>
			<p>
				By {user.first_name || authUser.first_name} {user.last_name || authUser.last_name} on{' '}
				<Moment>{created_at}</Moment>
			</p>
		</div>
	);
};

ReviewItem.propTypes = {
	review: PropTypes.object.isRequired
};

export default ReviewItem;
