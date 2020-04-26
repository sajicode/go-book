import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const ResetPassword = (props) => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const { error, clearErrors, resetPassword, isAuthenticated } = authContext;
	const { setAlert } = alertContext;

	const params = new URLSearchParams(window.location.search);
	const token = params.get('token');

	useEffect(
		() => {
			if (isAuthenticated) {
				props.history.push('/home');
			}
			if (error && error !== 'Unauthorized. Login to access this page') {
				setAlert(error, 'danger');
				clearErrors();
			}
		},
		[ error, isAuthenticated, props.history ]
	);

	const [ user, setUser ] = useState({
		password: ''
	});

	const { password } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (password === '') {
			setAlert('Please input all fields', 'danger');
		} else {
			resetPassword(
				{
					password
				},
				token
			);
		}
	};

	return (
		<div className="form-container">
			<h1>Enter a new Password</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={onChange}
						required
						minLength="8"
					/>
				</div>
				<input type="submit" value="Reset" className="btn btn-primary btn-block" />
			</form>
		</div>
	);
};

export default ResetPassword;
