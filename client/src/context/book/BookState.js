import React, { useReducer } from 'react';
import axios from 'axios';
import BookContext from './bookContext';
import bookReducer from './bookReducer';
import { CREATE_BOOK, GET_BOOKS, BOOK_ERROR, BOOK_UPLOAD, BOOK_UPLOAD_ERROR, GET_BOOK } from '../types';

const BookState = (props) => {
	const initialState = {
		books: null,
		book: null,
		error: null,
		bookCover: null
	};

	const [ state, dispatch ] = useReducer(bookReducer, initialState);

	//* Actions
	//* Get Books
	const getBooks = async () => {
		try {
			const res = await axios.get('/api/books?page=1&limit=100');
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

	//* Get Book
	const getBook = async (book_id) => {
		try {
			const res = await axios.get(`/api/books/${book_id}`);
			dispatch({
				type: GET_BOOK,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: BOOK_ERROR,
				payload: error.response.data.message
			});
		}
	};

	//* Add a Book
	const addBook = async (formData) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post(`/api/books/new`, formData, config);

			dispatch({
				type: CREATE_BOOK,
				payload: res.data.data
			});
		} catch (error) {
			dispatch({
				type: BOOK_ERROR,
				payload: error.response.data.message
			});
		}
	};

	//TODO set cloudinary url in env
	const uploadBookCover = async (e) => {
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
				type: BOOK_UPLOAD,
				payload: file.secure_url
			});
		} catch (error) {
			console.error('upload error', error);
			dispatch({
				type: BOOK_UPLOAD_ERROR,
				payload: 'Image upload error'
			});
		}
	};

	return (
		<BookContext.Provider
			value={{
				books: state.books,
				book: state.book,
				bookCover: state.bookCover,
				error: state.error,
				getBooks,
				getBook,
				addBook,
				uploadBookCover
			}}
		>
			{props.children}
		</BookContext.Provider>
	);
};

export default BookState;
