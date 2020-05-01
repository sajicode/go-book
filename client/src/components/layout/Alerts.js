import React, { useContext } from 'react';
import styled from 'styled-components';
import AlertContext from '../../context/alert/alertContext';

const Alerts = () => {
	const alertContext = useContext(AlertContext);

	return (
		alertContext.alerts.length > 0 &&
		alertContext.alerts.map((alert) => (
			<AlertStyle key={alert.id} className={`alert alert-${alert.type}`}>
				<i className="fas fa-info-circle" /> {alert.msg}
			</AlertStyle>
		))
	);
};

const AlertStyle = styled.div`
	font-size: 1.5rem;
	color: #282c34;
	text-align: center;
	font-weight: bold;
`;

export default Alerts;
