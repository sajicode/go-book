import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';

const Register = (props) => {
	const authContext = useContext(AuthContext);

	const { register, error, isAuthenticated } = authContext;

	useEffect(
		() => {
			if (isAuthenticated) {
				props.history.push('/book');
			}
		},
		// eslint-disable-next-line
		[ error, isAuthenticated, props.history ]
	);

	const [ user, setUser ] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: ''
	});

	const { first_name, last_name, email, password } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		register({
			first_name,
			last_name,
			email,
			password
		});
	};

	return (
		<div className="form-container">
			<h1>
				Account <span className="text-primary">Register</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="first_name">First Name</label>
					<input type="text" name="first_name" value={first_name} onChange={onChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="last_name">Last Name</label>
					<input type="text" name="last_name" value={last_name} onChange={onChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input type="email" name="email" value={email} onChange={onChange} required />
				</div>
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
				<input type="submit" value="Register" className="btn btn-primary btn-block" />
			</form>
		</div>
	);
};

export default Register;
