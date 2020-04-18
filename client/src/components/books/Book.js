import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';

const Book = () => {
	const authContext = useContext(AuthContext);

	const { loadUser } = authContext;

	useEffect(() => {
		loadUser();
	}, []);

	return (
		<div>
			<h2>Single Book displayed</h2>
		</div>
	);
};

export default Book;
