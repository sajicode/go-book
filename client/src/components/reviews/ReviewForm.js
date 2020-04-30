import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReviewContext from '../../context/review/reviewContext';
import AlertContext from '../../context/alert/alertContext';

const ReviewForm = ({ bookID }) => {
	const reviewContext = useContext(ReviewContext);
	const alertContext = useContext(AlertContext);

	const { addReview } = reviewContext;
	const { setAlert } = alertContext;


	const [ review, setReview ] = useState({
		notes: ''
	});

	const { notes } = review;

	const onChange = (e) => setReview({ ...review, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (notes === '') {
			setAlert('Please enter all fields');
		} else {
			addReview(
				{
					notes
				},
				bookID
			);
			setReview({ notes: '' });
		}
	};

	return (
		<FormContainer>
			<BookTitle>Add a Review</BookTitle>
			<BookForm onSubmit={onSubmit}>
				<FormGroup>
					<FormInput type="text" name="notes" value={notes} onChange={onChange} required />
				</FormGroup>
				<SubmitButton type="submit" value="Submit" />
			</BookForm>
		</FormContainer>
	);
};

ReviewForm.propTypes = {
	bookID: PropTypes.number.isRequired
};

const BookTitle = styled.h1`
	text-align: center;
	margin-bottom: 2rem;
`;

const FormContainer = styled.div`
	max-width: 500px;
  margin: 2rem auto;
  overflow: hidden;
	padding: 0 2rem;
`;

const BookForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;
	width: 80%;
`;

const FormInput = styled.textarea`
	width: 100%;
	height: 8rem;
	border-radius: .5rem;
`;

const SubmitButton = styled.input`
	width: 30rem;
	height: 3rem;
	font-size: 2rem;
	background-color: #eeba6d;
	border-radius: .5rem;
	cursor: pointer;
`;

export default ReviewForm;
