import React from 'react';
import PropTypes from 'prop-types';
import ReviewItem from './ReviewItem';

const Reviews = ({ reviews }) => {
	return <div>{reviews.map((review) => <ReviewItem review={review} key={review.id} />)}</div>;
};

Reviews.propTypes = {
	reviews: PropTypes.array.isRequired
};

export default Reviews;
