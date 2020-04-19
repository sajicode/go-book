import React, { Fragment, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);

	const { isAuthenticated, logout, user, loadUser } = authContext;

	useEffect(() => {
		loadUser();
	}, []);

	const onLogout = () => {
		logout();
	};

	const authLinks = (
		<Fragment>
			<li>
				Hello {user && user.first_name}
				<span>
					{user && <img src={user.avatar} alt={user.first_name + 'image'} height="40px" width="40px" />}
				</span>
			</li>
			<li>
				<a onClick={onLogout} href="/">
					<i className="fas fa-sign-out-alt" /> <span className="hide-sm">Logout</span>
				</a>
			</li>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<li>
				<Link to="/register">Register</Link>
			</li>
			<li>
				<Link to="/login">Login</Link>
			</li>
		</Fragment>
	);

	return (
		<div className="navbar bg-primary">
			<h1>
				<i className={icon} />
				{title}
			</h1>
			<ul>{isAuthenticated ? authLinks : guestLinks}</ul>
		</div>
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

export default Navbar;
