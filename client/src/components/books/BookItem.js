import React from 'react';
import PropTypes from 'prop-types';

const BookItem = ({ book }) => {
	const { id, title, image, author, summary } = book;
	return (
		<div>
			<h1>{title}</h1>
			<img src={image} alt={title} />
			<h2>{author}</h2>
			<p>{summary}</p>
		</div>
	);
};

BookItem.propTypes = {
	book: PropTypes.object.isRequired
};

export default BookItem;
