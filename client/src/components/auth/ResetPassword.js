import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
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
					// eslint-disable-next-line
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
		<FormContainer>
			<FormTitle>Enter a new Password</FormTitle>
			<FormStyle onSubmit={onSubmit}>
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
				<SubmitButton type="submit" value="Reset" className="btn btn-primary btn-block" />
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

export default ResetPassword;
