import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReviewItem from './ReviewItem';

const Reviews = ({ reviews }) => {
	return <ReviewsContainer>{reviews.map((review) => <ReviewItem review={review} key={review.id} />)}</ReviewsContainer>;
};

Reviews.propTypes = {
	reviews: PropTypes.array.isRequired
};

const ReviewsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 4rem;
`;

export default Reviews;
