import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import '../../App.css';

const EditUserForm = ({ toggle }) => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const { error, user: currentUser, avatar: userAvatar, uploadAvatar, updateUser } = authContext;
	const { setAlert } = alertContext;

	useEffect(
		() => {
			if (error) {
				setAlert(error, 'danger');
			}
		},
		// eslint-disable-next-line
		[ error, authContext, userAvatar ]
	);

	const [ user, setUser ] = useState({
		first_name: currentUser.first_name,
		last_name: currentUser.last_name,
		email: currentUser.email,
		bio: currentUser.bio,
		avatar: currentUser.avatar
	});

	const { first_name, last_name, email, bio, avatar } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		updateUser(
			{
				first_name,
				last_name,
				email,
				avatar: userAvatar ? userAvatar : currentUser.avatar,
				bio
			},
			currentUser.id
		);
		toggle(false);
	};

	return (
		<div className="modal">
			<div className="modal-backdrop">
				<div className="modal-body">
					<div className="form-container">
						<button className="modal-close" onClick={() => toggle(false)}>
							Close
						</button>
						<h1>Edit Details</h1>
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
							<input type="submit" value="Update" className="btn btn-primary btn-block" />
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

EditUserForm.propTypes = {
	toggle: PropTypes.func.isRequired
};

export default EditUserForm;
