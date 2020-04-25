import React, { useContext, Fragment, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import UserDetails from './UserDetails';
import Spinner from '../layout/Spinner';

const User = (props) => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const user_id = props.match.params.id;
	const { getUser, bookUser, error } = authContext;
	const { setAlert } = alertContext;

	useEffect(() => {
		getUser(user_id);

		if (error) {
			setAlert(error, 'danger');
		}
		// eslint-disable-next-line
	}, []);

	return (
		<Fragment>
			{bookUser ? (
				<div>
					<UserDetails user={bookUser} />
				</div>
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};

export default User;
