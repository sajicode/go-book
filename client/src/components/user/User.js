import React, { useContext, Fragment, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import UserDetails from './UserDetails';
import Spinner from '../layout/Spinner';
import EditUserForm from './EditUserForm';

const User = (props) => {
	const [ showForm, setShowForm ] = useState(false);
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const user_id = props.match.params.id;
	const { getUser, bookUser, error, user } = authContext;
	const { setAlert } = alertContext;

	useEffect(
		() => {
			getUser(user_id);

			if (error) {
				setAlert(error, 'danger');
			}
		},
					// eslint-disable-next-line
		[ error, user ]
	);

	const toggleForm = (status) => {
		setShowForm(status);
	};

	const propsUser = bookUser ? bookUser : user;

	return (
		<Fragment>
			{bookUser ? (
				<div>
					{user_id == user.id && (
						<div>
							<header className="top-banner">
								<div className="top-banner-inner">
									<p>
										<button onClick={() => toggleForm(true)}>Update your details</button>
									</p>
								</div>
							</header>
							{showForm && <EditUserForm toggle={toggleForm} />}
						</div>
					)}

					<UserDetails user={propsUser} />
				</div>
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};

export default User;
