const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

const Place = require('../models/place')
const place = require('../models/place')

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid // { pid: 'p1' }
	let place
	try {
		place = await Place.findById(placeId)
	} catch {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		)
		return next(error)
	}

	if (!place) {
		const error = new HttpError(
			'Could not find a place for the provided id.',
			404
		)
		return next(error)
	}
	//turn the object to a javascript object and remove the underscore of id
	res.json({ place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid
	let places
	try {
		places = await Place.find({ creator: userId })
	} catch {
		const error = new HttpError(
			'Fetching places failed, could not find a place',
			500
		)
		return next(error)
	}
	if (!places || places.length === 0) {
		return next(
			new HttpError(
				'Could not find places for the provided user id.',
				404
			)
		)
	}

	res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		)
	}

	const { title, description, address, creator } = req.body

	let coordinates
	try {
		coordinates = await getCoordsForAddress(address)
	} catch (error) {
		return next(error)
	}

	const createdPlace = new Place({
		title,
		description,
		location: coordinates,
		address,
		creator,
		image:
			'https://www.google.com/url?sa=i&url=https%3A%2F%2Fhatrabbits.com%2Fen%2Frandom-image%2F&psig=AOvVaw3j8C0Ig12AmUNZ0gMc78ZL&ust=1622599978362000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKCc1Iyu9fACFQAAAAAdAAAAABAD',
	})

	try {
		await createdPlace.save()
	} catch (err) {
		const error = new HttpError(
			'Creating place fail, please try again',
			500
		)
		return next(error)
	}

	res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		throw new HttpError(
			'Invalid inputs passed, please check your data.',
			422
		)
	}

	const { title, description } = req.body
	const placeId = req.params.pid

	let place
	try {
		place = await Place.findById(placeId)
	} catch (err) {
		const error = new HttpError(
			'something went wrong, could not update place',
			500
		)
		return next(error)
	}

	place.title = title
	place.description = description

	try {
		await place.save()
	} catch (err) {
		const error = new HttpError(
			'something went wrong could not update place',
			500
		)
		return next(error)
	}
	res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid
	try {
		place = await Place.findById(placeId)
	} catch (err) {
		const error = new HttpError('something went wrong, delete failed', 500)
		return next(error)
	}

	try {
		await place.remove()
	} catch {
		const error = new HttpError('something went wrong, delete failed', 500)
		return next(error)
	}
	res.status(200).json({ message: 'Deleted place.' })
}

module.exports = {
	getPlaceById,
	getPlacesByUserId,
	createPlace,
	updatePlace,
	deletePlace,
}
