import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import AuthContext from '../../context/auth/authContext';

Moment.globalMoment = moment;
Moment.globalFormat = 'D MMMM YYYY HH:mm';

const BookDetails = ({ book: { title, image, author, category, summary, user, created_at } }) => {
	const authContext = useContext(AuthContext);

	const { user: authUser } = authContext;
	return (
		<div>
			<BookTitle>{title}</BookTitle>
			<BookDetailStyle>
				<div>
					<ImageStyle src={image} alt={title} width="300" height="400" />
				</div>
				<div className="">
					<BookTitle>Author: {author}</BookTitle>
				<CategoryStyle>Category: {category}</CategoryStyle>
				<BookSummary>{summary}</BookSummary>
				<BookPoster>
					Posted By:{' '}
					<Link to={`/user/${user.id}`}>
							<UserName>
								{user.first_name || authUser.first_name} {user.last_name || authUser.last_name}
						</UserName>
					</Link>{' '}
					on <Moment>{created_at}</Moment>
				</BookPoster>
				</div>
			</BookDetailStyle>
		</div>
		
	);
};

BookDetails.propTypes = {
	book: PropTypes.object.isRequired
};

const BookTitle = styled.h1`
	text-align: center;
	margin-bottom: 2rem;
`;

const CategoryStyle = styled.h3`
	text-align: center;
	margin-bottom: 2rem;
`;

const BookSummary = styled.p`
	font-size: 1.2rem;
	color: #fff;
`;

const BookPoster = styled.p`
	margin-top: 4rem;
	font-size: 1.2rem;
`;

const UserName = styled.span`
	color: #fff;
`;

const ImageStyle = styled.img`
	@media (max-width: 500px) {
		width: 80%;
		height: 120;
	}
`;

const BookDetailStyle = styled.div`
	display: flex;
	flex-direction: row;
	padding: 4rem;
	justify-content: space-evenly;

	@media (max-width: 500px) {
		flex-direction: column;
		width: 90%;
	}

	@media(min-width: 501px) and (max-width: 1024px) {
    * {
			width: 80%;
		}
  }
`;

export default BookDetails;
