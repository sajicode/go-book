import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/pages/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Book from './components/books/Book';
import Home from './components/pages/Home';

import AlertState from './context/alert/AlertState';
import AuthState from './context/auth/AuthState';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/pages/NotFound';

const App = () => {
	return (
		<AuthState>
			<AlertState>
				<Router>
					<Fragment>
						<div>
							<Switch>
								<Route exact path="/" component={Landing} />
								<Route exact path="/register" component={Register} />
								<Route exact path="/login" component={Login} />
								<Route exact path="/home" component={Home} />
								<PrivateRoute exact path="/book" component={Book} />
								<Route component={NotFound} />
							</Switch>
						</div>
					</Fragment>
				</Router>
			</AlertState>
		</AuthState>
	);
};

export default App;
