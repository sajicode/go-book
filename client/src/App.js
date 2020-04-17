import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/pages/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Book from './components/books/Book';
import Home from './components/pages/Home';

import AuthState from './context/auth/AuthState';
import PrivateRoute from './components/routing/PrivateRoute';

const App = () => {
	return (
		<AuthState>
			<Router>
				<Fragment>
					<div>
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/home" component={Home} />
							<PrivateRoute exact path="/book" component={Book} />
						</Switch>
					</div>
				</Fragment>
			</Router>
		</AuthState>
	);
};

export default App;
