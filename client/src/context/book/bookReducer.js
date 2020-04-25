import {
	CREATE_BOOK,
	GET_BOOK,
	GET_BOOKS,
	CLEAR_BOOKS,
	BOOK_ERROR,
	CLEAR_BOOK,
	UPDATE_BOOK,
	BOOK_UPLOAD
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case CREATE_BOOK:
			return {
				...state,
				books: [ action.payload, ...state.books ]
			};
		case GET_BOOK:
			return {
				...state,
				book: action.payload
			};
		case GET_BOOKS:
			return {
				...state,
				books: action.payload,
				loading: false
			};
		case CLEAR_BOOK:
			return {
				...state,
				book: null
			};
		case CLEAR_BOOKS:
			return {
				...state,
				book: null,
				books: null,
				error: null
			};
		case UPDATE_BOOK:
			return {
				...state,
				books: state.books.map((book) => (book.id === action.payload.id ? action.payload : book)),
				loading: false
			};
		case BOOK_ERROR:
			return {
				...state,
				error: action.payload
			};
		case BOOK_UPLOAD:
			return {
				...state,
				bookCover: action.payload
			};
		default:
			return state;
	}
};
