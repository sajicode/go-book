import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import BookContext from '../../context/book/bookContext';
import '../../App.css';

const BookForm = ({ toggle }) => {
	const bookContext = useContext(BookContext);
	const { addBook, uploadBookCover, bookCover } = bookContext;

	const [ book, setBook ] = useState({
		title: '',
		author: '',
		category: '',
		summary: ''
	});

	const { title, author, category, summary } = book;

	const onChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		addBook({
			title,
			author,
			category,
			summary,
			image: bookCover
		});
		toggle(false);
	};

	return (
		<div className="modal">
			<div className="modal-backdrop" />
			<div className="modal-body">
				<button className="modal-close" onClick={() => toggle(false)}>
					Close
				</button>
				<h1>Add a Book for Review</h1>
				<form onSubmit={onSubmit}>
					<div className="form-group">
						<label htmlFor="image">Book Cover</label>
						<input
							type="file"
							name="image"
							onChange={uploadBookCover}
							placeholder="Upload cover"
							required
						/>
						{bookCover && <img src={bookCover} alt="Book cover Preview" width="120" height="180" />}
					</div>
					<div className="form-group">
						<label htmlFor="title">Book Title</label>
						<input type="text" name="title" value={title} onChange={onChange} required />
					</div>
					<div className="form-group">
						<label htmlFor="author">Author</label>
						<input type="text" name="author" value={author} onChange={onChange} required />
					</div>
					<div className="form-group">
						<label htmlFor="category">Category</label>
						<input type="text" name="category" value={category} onChange={onChange} required />
					</div>
					<div className="form-group">
						<label htmlFor="password">Summary</label>
						<input type="text" name="summary" value={summary} onChange={onChange} required />
					</div>
					<input type="submit" value="Add Book" className="btn btn-primary btn-block" />
				</form>
			</div>
		</div>
	);
};

BookForm.propTypes = {
	toggle: PropTypes.func.isRequired
};

export default BookForm;
