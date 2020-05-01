import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const Login = (props) => {
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const { login, error, isAuthenticated, clearErrors } = authContext;
	const { setAlert } = alertContext;

	useEffect(
		() => {
			if (isAuthenticated) {
				props.history.push('/home');
			}
			if (error === 'resource not found') {
				setAlert('User not found', 'danger');
				clearErrors();
			} else if (error === 'incorrect password provided') {
				setAlert(error, 'danger');
				clearErrors();
			}
		},
		// eslint-disable-next-line
		[ error, isAuthenticated, props.history ]
	);

	const [ user, setUser ] = useState({
		email: '',
		password: ''
	});

	const { email, password } = user;

	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (email === '' || password === '') {
			setAlert('Please input all fields', 'danger');
		} else {
			login({
				email,
				password
			});
		}
	};

	return (
		<FormContainer>
			<FormTitle>
				User Login
			</FormTitle>
			<FormStyle onSubmit={onSubmit}>
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
				<SubmitButton type="submit" value="Login" />
			</FormStyle>

			<ForgotLink>
				Forgot Password ? <Link to="/forgot">
					<ForgotClick>
						Click here to reset
					</ForgotClick>
				</Link>
			</ForgotLink>
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

const ForgotLink = styled.div`
	font-size: 1.5rem;
`;

const ForgotClick = styled.span`
	color: #eeba6d;

	&:hover {
		color: #fff;
	}
`;

export default Login;
