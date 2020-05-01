import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
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
		<FormContainer>
			<FormTitle>
				User Registration
			</FormTitle>
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
				<FormGroup>
					<FormLabel htmlFor="password">Password</FormLabel>
					<FormInput
						type="password"
						name="password"
						value={password}
						onChange={onChange}
						required
						minLength="8"
					/>
				</FormGroup>
				<SubmitButton type="submit" value="Register" />
			</FormStyle>
		</FormContainer>
	);
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

export default Register;
