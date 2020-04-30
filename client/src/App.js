import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/routing/PrivateRoute';

import Landing from './components/pages/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Book from './components/books/Book';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Navbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';
import User from './components/user/User';

import AlertState from './context/alert/AlertState';
import AuthState from './context/auth/AuthState';
import BookState from './context/book/BookState';
import ReviewState from './context/review/ReviewState';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

const App = () => {
	return (
		<AuthState>
			<BookState>
				<ReviewState>
					<AlertState>
						<Router>
							<Fragment>
								<Navbar title="RB" />
								<div className="container">
									<Alerts />
									<Switch>
										<PrivateRoute exact path="/book/:id" component={Book} />
										<PrivateRoute exact path="/user/:id" component={User} />
										<Route exact path="/" component={Landing} />
										<Route exact path="/register" component={Register} />
										<Route exact path="/login" component={Login} />
										<Route exact path="/home" component={Home} />
										<Route exact path="/forgot" component={ForgotPassword} />
										<Route exact path="/reset" component={ResetPassword} />
										<Route component={NotFound} />
									</Switch>
								</div>
							</Fragment>
						</Router>
					</AlertState>
				</ReviewState>
			</BookState>
		</AuthState>
	);
};

export default App;
