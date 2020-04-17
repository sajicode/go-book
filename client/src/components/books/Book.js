import React, { useContext } from 'react';
import AuthContext from '../../context/auth/authContext';

const Book = () => {
	const authContext = useContext(AuthContext);

	const { allState } = authContext;
	console.log('book page', allState);
	return (
		<div>
			<h2>Single Book displayed</h2>
		</div>
	);
};

export default Book;
