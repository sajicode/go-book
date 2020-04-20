import React from 'react';
import PropTypes from 'prop-types';

const BookItem = ({ book }) => {
	const { title, image, author, summary, category } = book;
	return (
		<div>
			<h1>{title}</h1>
			<img src={image} alt={title} width="300" height="480" />
			<h2>{author}</h2>
			<h3>{category}</h3>
			<p>{summary}</p>
		</div>
	);
};

BookItem.propTypes = {
	book: PropTypes.object.isRequired
};

export default BookItem;
