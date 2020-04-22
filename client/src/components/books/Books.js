import React, { useContext, useEffect, Fragment, useState } from 'react';
import BookContext from '../../context/book/bookContext';
import AuthContext from '../../context/auth/authContext';
import BookItem from './BookItem';
import BookForm from './BookForm';
import Spinner from '../layout/Spinner';
import '../../App.css';

const Books = () => {
	const [ showForm, setShowForm ] = useState(false);
	const bookContext = useContext(BookContext);
	const authContext = useContext(AuthContext);

	const { books, getBooks, loading } = bookContext;
	const { isAuthenticated } = authContext;

	useEffect(() => {
		getBooks();
		// eslint-disable-next-line
	}, []);

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
