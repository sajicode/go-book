import React, { useContext, useEffect, Fragment } from 'react';
import BookContext from '../../context/book/bookContext';
import BookItem from './BookItem';
import Spinner from '../layout/Spinner';

const Books = () => {
	const bookContext = useContext(BookContext);
	const { books, getBooks, loading } = bookContext;
	console.log('books', books);

	useEffect(() => {
		getBooks();
	}, []);
	return (
		<Fragment>
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
