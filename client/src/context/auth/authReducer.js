import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	CLEAR_ERRORS,
	LOGOUT,
	USER_LOADED,
	USER_LOAD_FAIL,
	AVATAR_UPLOAD,
	AVATAR_ERROR,
	GET_USER,
	GET_USER_FAIL,
	TRIGGER_SUCCESS,
	ALL_ERRORS,
	RESET_SUCCESS
} from '../types';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export default (state, action) => {
	switch (action.type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload,
				bookUser: null
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
		case RESET_SUCCESS:
			//* set cookie
			cookie.set('remember_token', action.payload.data.remember, { path: '/' });
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				loading: false
			};
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case LOGOUT:
		case USER_LOAD_FAIL:
			//* unset cookie
			cookie.remove('remember_token');
			return {
				...state,
				isAuthenticated: false,
				loading: false,
				user: null,
				error: action.payload
			};
		case AVATAR_UPLOAD:
			return {
				...state,
				avatar: action.payload
			};
		case AVATAR_ERROR:
			return {
				...state,
				error: action.payload
			};
		case CLEAR_ERRORS:
			return {
				...state,
				error: null
			};
		case GET_USER:
			return {
				...state,
				bookUser: action.payload
			};
		case GET_USER_FAIL:
			return {
				...state,
				error: action.payload
			};
		case TRIGGER_SUCCESS:
			return {
				...state,
				message: action.payload
			};
		case ALL_ERRORS:
			return {
				...state,
				error: action.payload
			};
		default:
			return state;
	}
};
