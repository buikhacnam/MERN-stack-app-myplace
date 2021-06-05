import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import User from './user/pages/User'

function App() {
	return (
		<Router>
			<MainNavigation />
			<main>
				<Switch>
					<Route path='/' exact>
						<User />
					</Route>
					<Route path='/places/new' exact>
						<div>hello from places/new</div>
					</Route>
					<Redirect to='/' />
				</Switch>
			</main>
		</Router>
	)
}

export default App
