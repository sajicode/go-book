import React from 'react';
import PropTypes from 'prop-types';

const UserDetails = ({ user }) => {
	const { avatar, first_name, last_name, bio } = user;
	return (
		<div>
			<img src={avatar} alt={first_name} width="200" height="200" />
			<div className="">
				<h2>
					{first_name} {last_name}
				</h2>
				<p>{bio}</p>
			</div>
		</div>
	);
};

UserDetails.propTypes = {
	user: PropTypes.object.isRequired
};

export default UserDetails;
