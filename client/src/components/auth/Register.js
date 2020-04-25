import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const Register = (props) => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const { register, error, isAuthenticated, avatar, uploadAvatar, clearErrors } = authContext;
	const { setAlert } = alertContext;

	useEffect(
		() => {
			if (isAuthenticated) {
				props.history.push('/home');
			}

			if (error === 'email address is already taken') {
				setAlert(error, 'danger');
				clearErrors();
			}
		},
		// eslint-disable-next-line
		[ error, isAuthenticated, props.history ]
	);

	const [ user, setUser ] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		bio: ''
	});

	const { first_name, last_name, email, password, bio } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		register({
			first_name,
			last_name,
			email,
			password,
			avatar,
			bio
		});
	};

	return (
		<div className="form-container">
			<h1>
				Account <span className="text-primary">Register</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="avatar">Photo</label>
					<input type="file" name="avatar" onChange={uploadAvatar} placeholder="Upload photo" />
					{avatar && <img src={avatar} alt="Upload Preview" width="70" height="70" />}
				</div>
				<div className="form-group">
					<label htmlFor="first_name">First Name</label>
					<input type="text" name="first_name" value={first_name} onChange={onChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="last_name">Last Name</label>
					<input type="text" name="last_name" value={last_name} onChange={onChange} required />
				</div>
				<div className="form-group">
					<label htmlFor="bio">Bio</label>
					<input type="text" name="bio" value={bio} onChange={onChange} />
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
