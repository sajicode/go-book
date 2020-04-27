import React, { useContext, useEffect, Fragment, useState } from 'react';
import BookContext from '../../context/book/bookContext';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import BookItem from './BookItem';
import BookForm from './BookForm';
import Spinner from '../layout/Spinner';
import '../../App.css';

const Books = () => {
	const [ showForm, setShowForm ] = useState(false);
	const bookContext = useContext(BookContext);
	const authContext = useContext(AuthContext);
	const alertContext = useContext(AlertContext);

	const { books, getBooks, loading } = bookContext;
	const { isAuthenticated, error, clearErrors } = authContext;
	const { setAlert } = alertContext;

	useEffect(
		() => {
			getBooks();

			if (error === 'Unauthorized. Login to access this page') {
				setAlert('Create an account or Login to view book reviews', 'primary', 60000);
				clearErrors();
			}
		},
					// eslint-disable-next-line
		[ error ]
	);

	const toggleForm = (status) => {
		setShowForm(status);
	};

	return (
		<Fragment>
			{isAuthenticated && (
				<div>
					<header className="top-banner">
						<div className="top-banner-inner">
							<p>
								<button onClick={() => toggleForm(true)}>Add a Book</button>
							</p>
						</div>
					</header>
					{showForm && <BookForm toggle={toggleForm} />}
				</div>
			)}
			{(books !== null) & !loading ? (
				books.map((book) => (
					<div key={book.id}>
						<BookItem book={book} />
					</div>
				))
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};

export default Books;
