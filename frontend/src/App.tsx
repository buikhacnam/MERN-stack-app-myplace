import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import User from './user/pages/User'
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';

function App() {
	return (
		<Router>
			<MainNavigation />
			<main>
				<Switch>
					<Route path='/' exact>
						<User />
					</Route>
					<Route path='/:userId/places' exact>
						<UserPlaces />
					</Route>
					<Route path='/places/new' exact>
						<NewPlace />
					</Route>
					<Redirect to='/' />
				</Switch>
			</main>
		</Router>
	)
}

export default App
