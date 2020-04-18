import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	USER_LOAD_FAIL,
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
		isAuthenticated: cookie.get('remember_token') ? true : false,
		loading: false,
		user: null,
		error: null
	};

	const [ state, dispatch ] = useReducer(authReducer, initialState);

	// ? don't know if we need this
	const loadUser = async (data) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			const token = cookie.get('remember_token');
			const res = await axios.get(`/api/users/info?token=${token}`, config);
			dispatch({
				type: USER_LOADED,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: USER_LOAD_FAIL,
				payload: error.response.data.message
			});
		}
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
			loadUser();
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
			loadUser();
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
