import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const ForgotPassword = () => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const { triggerReset, error, message, clearErrors } = authContext;
	const { setAlert } = alertContext;

	useEffect(
		() => {
			if (error === 'resource not found') {
				setAlert('Account does not exist', 'danger');
				clearErrors();
			}

			if (message) {
				setAlert(message, 'success');
				clearErrors();
			}
		},
					// eslint-disable-next-line
		[ error, message ]
	);

	const [ user, setUser ] = useState({
		email: ''
	});

	const { email } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (email === '') {
			setAlert('Please input all fields', 'danger');
		} else {
			triggerReset({
				email
			});
		}
	};

	return (
		<div className="form-container">
			<h1>Password Reset</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input type="email" name="email" value={email} onChange={onChange} required />
				</div>
				<input type="submit" value="Send" className="btn btn-primary btn-block" />
			</form>
		</div>
	);
};

export default ForgotPassword;
