import { useState, useCallback, useEffect } from 'react'

let logoutTimer: any
const useAuth = () => {
	const [token, setToken] = useState(null)
	const [userId, setUserId] = useState(null)
	const [tokenExpirationDate, setTokenExpirationDate] = useState<any>(null)
	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData') || '{}')
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(
				storedData.userId,
				storedData.token,
				new Date(storedData.expiration)
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime()
			logoutTimer = setTimeout(logout, remainingTime)
		} else {
			clearTimeout(logoutTimer)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, tokenExpirationDate])

	const login = useCallback((uId, token, experationDate) => {
		setToken(token)
		setUserId(uId)
		//generate the time from login and plus 1 hour
		const tokenExpirationDate = new Date(
			new Date().getTime() + 100 * 60 * 60
		)
		setTokenExpirationDate(tokenExpirationDate)
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uId,
				token: token,
				expiration: experationDate || tokenExpirationDate.toISOString(),
			})
		)
	}, [])

	const logout = useCallback(() => {
		setToken(null)
		setUserId(null)
		setTokenExpirationDate(null)
		localStorage.removeItem('userData')
	}, [])

	return { token, login, logout, userId }
}

export default useAuth
