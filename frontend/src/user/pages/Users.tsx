import React, { useEffect, useState, useRef } from 'react'
import UserList from '../components/UserList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import useHttpClient from '../../shared/hooks/http-hook'

export default function User() {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
	const [loadedUsers, setLoadedUers] = useState([
		{ id: '', name: '', image: '', places: [] },
	])

    const fetchUser = useRef(() => {})

	useEffect(() => {
		fetchUser.current()
	}, [fetchUser])

	fetchUser.current = async () => {
		try {
			const responseData = await sendRequest('http://localhost:5000/api/users')
			setLoadedUers(responseData.users)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedUsers && <UserList items={loadedUsers} />}
		</>
	)
}
