const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

const Place = require('../models/place')
const User = require('../models/user')

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

	// let places;
	let userWithPlaces
	try {
		userWithPlaces = await User.findById(userId).populate('places')
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again later',
			500
		)
		return next(error)
	}

	// if (!places || places.length === 0) {
	if (!userWithPlaces || userWithPlaces.places.length === 0) {
		return next(
			new HttpError(
				'Could not find places for the provided user id.',
				404
			)
		)
	}

	res.json({
		places: userWithPlaces.places.map(place =>
			place.toObject({ getters: true })
		),
	})
}

const createPlace = async (req, res, next) => { // by user id
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

	let user
	try {
		user = await User.findById(creator)
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again',
			500
		)
		return next(error)
	}
	
	if (!user) {
		const error = new HttpError('Could not find user for provided id', 404)
		return next(error)
	}

	try {
		// check if all the operations work fine, otherwise roll back to the current database (making no changes)
		const sess = await mongoose.startSession() // define current session provided by mongooses
		sess.startTransaction() // note that transaction doesnt work when the collection doesnt exist
		await createdPlace.save({ sesstion: sess })
		user.places.push(createdPlace) //push here means mongoose only add createdPlace id to User collection, not a standard javascript push though
		await user.save({ sesstion: sess })
		await sess.commitTransaction()
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again',
			500
		)
		return next(error)
	}

	res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
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

	let place
	try {
		// populate allows to refer to document sorted in another collection and to work with data in that existing document of that collection
		// to do so we need relation between 2 documents and we need to use ref in each of the collection to refer to the other ones
		// creator property contains user id, mongoose then take this id and search for entire data store in user document
		place = await Place.findById(placeId).populate('creator')
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete place.',
			500
		)
		return next(error)
	}

	if (!place) {
		const error = new HttpError('Could not find place for this id.', 404)
		return next(error)
	}

	try {
		const sess = await mongoose.startSession()
		sess.startTransaction()
		await place.remove({ session: sess })
		place.creator.places.pull(place) // this will remove the id in the user collection
		await place.creator.save({ session: sess })
		await sess.commitTransaction()
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete place.',
			500
		)
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
