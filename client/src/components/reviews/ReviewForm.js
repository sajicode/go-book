import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import ReviewContext from '../../context/review/reviewContext';

const ReviewForm = ({ bookID }) => {
	const reviewContext = useContext(ReviewContext);

	const { addReview } = reviewContext;

	const [ review, setReview ] = useState({
		notes: ''
	});

	const { notes } = review;

	const onChange = (e) => setReview({ ...review, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (notes === '') {
			//TODO use alerts
			console.log('Please enter all fields');
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
		<div className="form-container">
			<h1>Add a Review</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="notes">Review</label>
					<input type="text" name="notes" value={notes} onChange={onChange} required />
				</div>
				<input type="submit" value="Add Review" className="btn btn-primary btn-block" />
			</form>
		</div>
	);
};

ReviewForm.propTypes = {
	bookID: PropTypes.number.isRequired
};

export default ReviewForm;
