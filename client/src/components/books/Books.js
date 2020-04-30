import React, { useContext, useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
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
				setAlert('Create an account or Login to view book reviews', 'primary');
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
								<ButtonStyle onClick={() => toggleForm(true)}>Add a Book</ButtonStyle>
							</p>
						</div>
					</header>
					{showForm && <BookForm toggle={toggleForm} />}
				</div>
			)}
			{(books !== null) & !loading ? (
				<BookList>
					{
						books.map((book) => (
							<div key={book.id}>
								<BookItem book={book} />
							</div>
						))
					}
				</BookList>
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};

const BookList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(36rem, 1fr));
	grid-auto-rows: 1fr;
	grid-gap: 3rem;
	grid-auto-flow: dense;
	margin: 3rem;
	justify-items: center;
	width: 100%;
`;

const ButtonStyle = styled.button`
	width: 30rem;
	height: 5rem;
	font-size: 2rem;
	margin-right: 7rem;
`;

export default Books;
