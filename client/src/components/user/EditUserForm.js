import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
					<FormContainer>
						<button className="modal-close" onClick={() => toggle(false)}>
							Close
						</button>
						<FormTitle>Edit Details</FormTitle>
						<FormStyle onSubmit={onSubmit}>
							<FormGroup>
								<FormLabel htmlFor="avatar">Photo</FormLabel>
								<FormInput type="file" name="avatar" onChange={uploadAvatar} placeholder="Upload photo" />
								{avatar && <img src={avatar} alt="Upload Preview" width="70" height="70" />}
							</FormGroup>
							<FormGroup>
								<FormLabel htmlFor="first_name">First Name</FormLabel>
								<FormInput type="text" name="first_name" value={first_name} onChange={onChange} required />
							</FormGroup>
							<FormGroup>
								<FormLabel htmlFor="last_name">Last Name</FormLabel>
								<FormInput type="text" name="last_name" value={last_name} onChange={onChange} required />
							</FormGroup>
							<FormGroup>
								<FormLabel htmlFor="bio">Bio</FormLabel>
								<FormTextArea type="text" name="bio" value={bio} onChange={onChange} />
							</FormGroup>
							<FormGroup>
								<FormLabel htmlFor="email">Email</FormLabel>
								<FormInput type="email" name="email" value={email} onChange={onChange} required />
							</FormGroup>
							<SubmitButton type="submit" value="Update" />
						</FormStyle>
					</FormContainer>
				</div>
			</div>
		</div>
	);
};

EditUserForm.propTypes = {
	toggle: PropTypes.func.isRequired
};

const FormContainer = styled.div`
	max-width: 500px;
  margin: 2rem auto;
  overflow: hidden;
	padding: 0 2rem;
	text-align: center;
`;

const FormTitle = styled.h1`
	text-align: center;
	margin-bottom: 2rem;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: row;
	align-content: center;
	justify-content: space-between;
	margin-bottom: 2rem;
	width: 80%;
`;

const FormInput = styled.input`
	width: 70%;
	height: 3rem;
	border-radius: .5rem;
`;

const FormTextArea = styled.textarea`
	width: 70%;
	height: 6rem;
	border-radius: .5rem;
`;

const FormLabel = styled.label`
	font-size: 1.5rem;
`;

const FormStyle = styled.form`
	padding: 2rem;
`;

const SubmitButton = styled.input`
	width: 80%;
	height: 3rem;
	font-size: 2rem;
	background-color: #eeba6d;
	border-radius: .5rem;
	cursor: pointer;
`;


export default EditUserForm;
