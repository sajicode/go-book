import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
		<ReviewStyle>
			<ReviewNotes>{notes}</ReviewNotes>
			<p>
				By <Link to={`/user/${user.id||authUser.id}`}>
					<Reviewer>
						{user.first_name || authUser.first_name} {user.last_name || authUser.last_name}
					</Reviewer>
				</Link> on{' '}
				<Moment>{created_at}</Moment>
			</p>
		</ReviewStyle>
	);
};

ReviewItem.propTypes = {
	review: PropTypes.object.isRequired
};

const ReviewStyle = styled.div`
	margin: 1rem;
	padding: 1rem;
`;

const ReviewNotes = styled.h3`
	color: #fff;
`;

const Reviewer = styled.span`
	color: #eeba6d;

	&:hover {
		color: #fff;
	}
`;

export default ReviewItem;
