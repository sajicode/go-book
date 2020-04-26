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
	LOGOUT,
	AVATAR_UPLOAD,
	AVATAR_ERROR,
	GET_USER,
	GET_USER_FAIL
} from '../types';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

// const serverURL = 'https://revbook13420.herokuapp.com';

const AuthState = (props) => {
	const initialState = {
		isAuthenticated: cookie.get('remember_token') ? true : false,
		loading: false,
		user: null,
		error: null,
		avatar: null,
		bookUser: null
	};

	const [ state, dispatch ] = useReducer(authReducer, initialState);

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

	//TODO set cloudinary url in env
	const uploadAvatar = async (e) => {
		const cloudinaryURL = 'https://api.cloudinary.com/v1_1/sajicode/image/upload';
		const files = e.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'revbook');

		try {
			const res = await fetch(cloudinaryURL, {
				method: 'POST',
				body: data
			});
			const file = await res.json();
			dispatch({
				type: AVATAR_UPLOAD,
				payload: file.secure_url
			});
		} catch (error) {
			console.error('upload error', error);
			dispatch({
				type: AVATAR_ERROR,
				payload: 'Image upload error'
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

	//* Update a user
	const updateUser = async (formData, id) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post(`/api/users/update/${id}`, formData, config);

			cookie.set('remember_token', res.data.data.remember, { path: '/' });
			dispatch({
				type: USER_LOADED,
				payload: res.data.data
			});
			loadUser();
		} catch (error) {
			dispatch({
				type: USER_LOAD_FAIL,
				payload: error.response.data.message
			});
		}
	};

	//* Get a User
	const getUser = async (id) => {
		try {
			const res = await axios.get(`/api/users/${id}`);
			dispatch({
				type: GET_USER,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: GET_USER_FAIL,
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
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				error: state.error,
				user: state.user,
				avatar: state.avatar,
				bookUser: state.bookUser,
				register,
				login,
				logout,
				getUser,
				updateUser,
				clearErrors,
				loadUser,
				uploadAvatar
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
