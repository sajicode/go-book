import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
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
		<FormContainer>
			<FormTitle>Password Reset</FormTitle>
			<FormStyle onSubmit={onSubmit}>
				<FormGroup>
					<FormLabel htmlFor="email">Email</FormLabel>
					<FormInput type="email" name="email" value={email} onChange={onChange} required />
				</FormGroup>
				<SubmitButton type="submit" value="Send" />
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

export default ForgotPassword;
