import React, {  useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from '../../context/auth/authContext';

const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);

	const { isAuthenticated, logout, user, loadUser } = authContext;

	useEffect(() => {
		loadUser();
		// eslint-disable-next-line
	}, []);

	const onLogout = () => {
		logout();
	};

	const authLinks = (
		<ListBox>
			<NavBarLi>
				<Link to="/home">Home</Link>
			</NavBarLi>
			<NavBarLi>
				<a onClick={onLogout} href="/">
					<i className="fas fa-sign-out-alt" /> <span className="hide-sm">Logout</span>
				</a>
			</NavBarLi>
			<NavBarLi>
				Hello {user && <Link to={`/user/${user.id}`}>{user.first_name}</Link>}	
			</NavBarLi>
			<div>		
					{user && (
						<Link to={`/user/${user.id}`}>
							<Avatar src={user.avatar} alt={user.first_name + 'image'} />
						</Link>
					)}
			</div>
			
		</ListBox>
	);

	const guestLinks = (
		<ListBox>
			<NavBarLi>
				<Link to="/home">Home</Link>
			</NavBarLi>
			<NavBarLi>
				<Link to="/register">Register</Link>
			</NavBarLi>
			<NavBarLi>
				<Link to="/login">Login</Link>
			</NavBarLi>
		</ListBox>
	);

	return (
		<NavBar>
			<h1>
				<i className={icon} />
				<Link to="/">{title}</Link>
			</h1>
			<NavBarUl>{isAuthenticated ? authLinks : guestLinks}</NavBarUl>
		</NavBar>
	);
};

Navbar.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string
};

Navbar.defaultProps = {
	title: 'RevBooks',
	icon: 'fas fa-id-card-alt'
};

const NavBar = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background: #eeba6d;
	justify-content: space-between;
	color: #282c34;
	z-index: 1;
	padding: 2rem;
	height: 4vh;
	max-width: 100%;
`;

const NavBarUl = styled.ul`
	display: flex;
	align-items: center;
	list-style-type: none;
`;

const NavBarLi = styled.li`
	display: block;
	padding: .5rem 1rem;
	font-size: 1.2rem;
	font-weight: bold;
	cursor: pointer;

	*:hover {
		border-bottom: 1px solid black;
	}
`;

const ListBox = styled.div`
	display: flex;
	flex-direction: row;
`;

const Avatar = styled.img`
	height: 40px;
	width: 40px;
	padding-left: 1rem;
`;

export default Navbar;
