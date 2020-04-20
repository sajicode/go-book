import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';

const Book = () => {
	const authContext = useContext(AuthContext);

	const { loadUser } = authContext;

	//TODO fetch book data & book reviews

	useEffect(() => {
		loadUser();
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<h2>Single Book displayed</h2>
		</div>
	);
};

export default Book;
