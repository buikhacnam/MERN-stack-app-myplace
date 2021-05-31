import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom'
import User from './user/pages/User'

function App() {
	return (
		<Router>
			<Switch>
				<Route path='/' exact>
					<User />
				</Route>
				<Route path='/places/new' exact>
					<div>hello from places/new</div>
				</Route>
				<Redirect to='/' />
			</Switch>
		</Router>
	)
}

export default App
