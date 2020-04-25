import React, { Fragment, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
		<Fragment>
			<li>
				<Link to="/home">Home</Link>
			</li>
			<li>
				Hello {user && <Link to={`/user/${user.id}`}>{user.first_name}</Link>}
				<span>
					{user && (
						<Link to={`/user/${user.id}`}>
							<img src={user.avatar} alt={user.first_name + 'image'} height="40px" width="40px" />
						</Link>
					)}
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
				<Link to="/home">Home</Link>
			</li>
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
				<Link to="/">{title}</Link>
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
