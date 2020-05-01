import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
				<FormContainer>
					<FormTitle>Add a Book for Review</FormTitle>
				<FormStyle onSubmit={onSubmit}>
					<FormGroup>
						<FormLabel htmlFor="image">Book Cover</FormLabel>
						<FormInput
							type="file"
							name="image"
							onChange={uploadBookCover}
							placeholder="Upload cover"
							required
						/>
						{bookCover && <img src={bookCover} alt="Book cover Preview" width="120" height="180" />}
					</FormGroup>
					<FormGroup>
						<FormLabel htmlFor="title">Book Title</FormLabel>
						<FormInput type="text" name="title" value={title} onChange={onChange} required />
					</FormGroup>
					<FormGroup>
						<FormLabel htmlFor="author">Author</FormLabel>
						<FormInput type="text" name="author" value={author} onChange={onChange} required />
					</FormGroup>
					<FormGroup>
						<FormLabel htmlFor="category">Category</FormLabel>
						<FormInput type="text" name="category" value={category} onChange={onChange} required />
					</FormGroup>
					<FormGroup>
						<FormLabel htmlFor="password">Summary</FormLabel>
						<FormTextArea type="text" name="summary" value={summary} onChange={onChange} required />
					</FormGroup>
					<SubmitButton type="submit" value="Add Book" className="btn btn-primary btn-block" />
				</FormStyle>
				</FormContainer>
			</div>
		</div>
	);
};

BookForm.propTypes = {
	toggle: PropTypes.func.isRequired
};

const FormContainer = styled.div`
	max-width: 500px;
  margin: 2rem auto;
  overflow: hidden;
	padding: 0 2rem;
	text-align: center;
`;

const FormTitle = styled.h1`
	text-align: center;
	margin-bottom: 2rem;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: row;
	align-content: center;
	justify-content: space-between;
	margin-bottom: 2rem;
	width: 80%;
`;

const FormInput = styled.input`
	width: 70%;
	height: 3rem;
	border-radius: .5rem;
`;

const FormTextArea = styled.textarea`
	width: 70%;
	height: 6rem;
	border-radius: .5rem;
`;

const FormLabel = styled.label`
	font-size: 1.5rem;
`;

const FormStyle = styled.form`
	padding: 2rem;
`;

const SubmitButton = styled.input`
	width: 80%;
	height: 3rem;
	font-size: 2rem;
	background-color: #eeba6d;
	border-radius: .5rem;
	cursor: pointer;
`;

export default BookForm;
