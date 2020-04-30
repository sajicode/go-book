import React from 'react';
import styled from 'styled-components';
import Books from '../books/Books';

const Home = () => {
	return (
		<HomeStyle>
			<Books />
		</HomeStyle>
	);
};

const HomeStyle = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
`;

export default Home;
