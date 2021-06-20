import React, { useRef, useState, useEffect } from 'react'

import Button from './Button'
import './ImageUpload.css'

const ImageUpload = props => {
	const filePickerRef = useRef(null)
	const [file, setFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState(false)

	useEffect(() => {
		if (file) {
			const fileReader = new FileReader()
			fileReader.onload = () => {
				setPreviewUrl(fileReader.result)
			}
			fileReader.readAsDataURL(file)
		}
	}, [file])

	const pickedHandler = event => {
		let pickedFile
		let fileIsValid = false
		if (event.target.files && event.target.files.length === 1) {
			pickedFile = event.target.files[0]
			setFile(pickedFile)
			fileIsValid = true
		}
		props.onInput(props.id, pickedFile, fileIsValid)
	}

	const pickImageHandler = () => {
		filePickerRef.current.click()
	}

	return (
		<div className='form-control'>
			<input
				id={props.id}
				ref={filePickerRef}
				style={{ display: 'none' }}
				type='file'
				accept='.jpg,.png,.jpeg'
				onChange={pickedHandler}
			/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className='image-upload__preview'>
					{previewUrl ? (
						<img src={previewUrl} alt='Preview' />
					) : (
						<p>Please pick an image.</p>
					)}
				</div>
				<Button type='button' onClick={pickImageHandler}>
					PICK IMAGE
				</Button>
			</div>
		</div>
	)
}

export default ImageUpload
