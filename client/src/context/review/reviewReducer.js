import {
	CREATE_REVIEW,
	GET_REVIEW,
	GET_REVIEWS,
	CLEAR_REVIEWS,
	REVIEW_ERROR,
	CLEAR_REVIEW,
	UPDATE_REVIEW
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case CREATE_REVIEW:
			return {
				...state,
				reviews: [ action.payload, ...state.reviews ]
			};
		case GET_REVIEW:
			return {
				...state,
				review: action.payload
			};
		case GET_REVIEWS:
			return {
				...state,
				reviews: action.payload,
				loading: false
			};
		case CLEAR_REVIEW:
			return {
				...state,
				review: null
			};
		case CLEAR_REVIEWS:
			return {
				...state,
				review: null,
				reviews: null,
				error: null
			};
		case UPDATE_REVIEW:
			return {
				...state,
				reviews: state.reviews.map((review) => (review.id === action.payload.id ? action.payload : review)),
				loading: false
			};
		case REVIEW_ERROR:
			return {
				...state,
				error: action.payload
			};
		default:
			return state;
	}
};
