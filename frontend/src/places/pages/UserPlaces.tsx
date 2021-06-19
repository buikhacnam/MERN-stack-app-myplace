import { useEffect, useState, useRef } from 'react'
import PlaceList from '../components/PlaceList'
import { useParams } from 'react-router-dom'
import useHttpClient from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
function UserPlaces() {
	const [loadedPlaces, setLoadedPlaces] = useState([
		{
			key: '',
			id: '',
			title: '',
			description: '',
			image: '',
			address: '',
			location: '',
			creator: '',
		},
	])
	const { isLoading, error, sendRequest, clearError } = useHttpClient()
	const { userId } = useParams<{ userId: '' }>()
	const fetchPlaces = useRef(() => {})

	fetchPlaces.current = async () => {
		try {
			const responseData = await sendRequest(
				`http://localhost:5000/api/places/user/${userId}`
			)
			setLoadedPlaces(responseData.places)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		fetchPlaces.current()
	}, [])

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
		</>
	)
}

export default UserPlaces
