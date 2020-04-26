import React, { useReducer } from 'react';
import axios from 'axios';
import ReviewContext from './reviewContext';
import reviewReducer from './reviewReducer';
import { CREATE_REVIEW, GET_REVIEWS, REVIEW_ERROR } from '../types';
import { serverURL } from '../../utils/helper';

const ReviewState = (props) => {
	const initialState = {
		reviews: null,
		review: null,
		error: null
	};

	const [ state, dispatch ] = useReducer(reviewReducer, initialState);

	//* Actions
	//* Get Reviews
	const getBookReviews = async (bookID) => {
		try {
			const res = await axios.get(`${serverURL}/api/books/${bookID}/reviews`, { withCredentials: true });
			dispatch({
				type: GET_REVIEWS,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: REVIEW_ERROR,
				payload: error.response.data.message
			});
		}
	};

	//* Add a Review
	const addReview = async (formData, bookID) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true
		};

		try {
			const res = await axios.post(`${serverURL}/api/books/${bookID}/review`, formData, config);
			console.log('forms', formData);
			dispatch({
				type: CREATE_REVIEW,
				payload: res.data.data
			});
		} catch (error) {
			console.log('errors', error.response);
			dispatch({
				type: REVIEW_ERROR,
				payload: 'Error adding review. Please try again.'
			});
		}
	};

	return (
		<ReviewContext.Provider
			value={{
				reviews: state.reviews,
				review: state.review,
				error: state.error,
				getBookReviews,
				addReview
			}}
		>
			{props.children}
		</ReviewContext.Provider>
	);
};

export default ReviewState;
