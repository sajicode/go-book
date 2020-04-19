import React, { useReducer } from 'react';
import axios from 'axios';
import BookContext from './bookContext';
import bookReducer from './bookReducer';
import { CREATE_BOOK, GET_BOOK, GET_BOOKS, CLEAR_BOOKS, BOOK_ERROR, CLEAR_BOOK, UPDATE_BOOK } from '../types';

const BookState = (props) => {
	const initialState = {
		books: null,
		book: null,
		error: null,
		test: 'sampled'
	};

	const [ state, dispatch ] = useReducer(bookReducer, initialState);

	//* Actions
	//* Get Books
	const getBooks = async () => {
		try {
			const res = await axios.get('/api/books?page=1&limit=20');
			console.log(res.data);
			dispatch({
				type: GET_BOOKS,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: BOOK_ERROR,
				payload: error.response.data.message
			});
		}
	};
	return (
		<BookContext.Provider
			value={{
				allState: state,
				books: state.books,
				book: state.book,
				test: state.test,
				error: state.error,
				getBooks
			}}
		>
			{props.children}
		</BookContext.Provider>
	);
};

export default BookState;
