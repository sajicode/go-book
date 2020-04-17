import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	CLEAR_ERRORS,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT
} from '../types';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

// const serverURL = 'https://revbook13420.herokuapp.com';

const AuthState = (props) => {
	const initialState = {
		isAuthenticated: null,
		loading: true,
		user: null,
		error: null
	};

	const [ state, dispatch ] = useReducer(authReducer, initialState);

	// ? don't know if we need this
	const loadUser = async (data) => {
		dispatch({
			type: USER_LOADED,
			payload: data.data
		});
	};

	//* Register user
	const register = async (formData) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post(`/api/users/signup`, formData, config);

			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data
			});
			loadUser(res.data);
		} catch (error) {
			dispatch({
				type: REGISTER_FAIL,
				payload: error.response.data.message
			});
		}
	};

	//* Login user
	const login = async (formData) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post(`/api/users/login`, formData, config);

			cookie.set('remember_token', res.data.data.remember, { path: '/' });
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data
			});
			loadUser(res.data);
		} catch (error) {
			dispatch({
				type: LOGIN_FAIL,
				payload: error.response.data.message
			});
		}
	};

	//* Logout
	const logout = () => dispatch({ type: LOGOUT });

	//* Clear Errors
	const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

	return (
		<AuthContext.Provider
			value={{
				allState: state,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				error: state.error,
				user: state.user,
				register,
				login,
				logout,
				clearErrors,
				loadUser
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
