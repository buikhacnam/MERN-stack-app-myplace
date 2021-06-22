import { useContext } from 'react'
import { useHistory } from 'react-router'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import './PlaceForm.css'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import useHttpClient from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

const NewPlace = () => {
	const { userId, token } = useContext(AuthContext)
	const { isLoading, error, sendRequest, clearError } = useHttpClient()
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
		},
		false
	)
	const history = useHistory()

	const placeSubmitHandler = async (event: any) => {
		event.preventDefault()
		try {
			const formData = new FormData()
			formData.append('title', formState.inputs.title.value)
			formData.append('description', formState.inputs.description.value)
			formData.append('address', formState.inputs.address.value)
			formData.append('creator', userId || '')
			formData.append('image', formState.inputs.image.value)
			await sendRequest(
				'http://localhost:5000/api/places',
				'POST',
				// JSON.stringify({
				// 	title: formState.inputs.title.value,
				// 	description: formState.inputs.description.value,
				// 	address: formState.inputs.address.value,
				// 	creator: userId,
				// }),
				formData,
				{Authorization: 'Bearer ' + token}
				// { 'Content-Type': 'application/json' }
			)
			// redirect users to different page (home page)
			history.push('/')
		} catch (error) {
			//console.log(error)
		}
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<form className='place-form' onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<ImageUpload
					center
					id='image'
					onInput={inputHandler}
					errorText='Please provide an image'
				/>
				<Input
					id='title'
					element='input'
					type='text'
					label='Title'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid title.'
					onInput={inputHandler}
				/>
				<Input
					id='description'
					element='textarea'
					label='Description'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid description (at least 5 characters).'
					onInput={inputHandler}
				/>
				<Input
					id='address'
					element='input'
					label='Address'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid address.'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</>
	)
}

export default NewPlace
