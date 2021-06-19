const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
	let users
	try {
		users = await User.find({}, '-password')
	} catch (err) {
		const error = new HttpError('fetch users failed', 500)
		return next(error)
	}
	res.json({ users: users.map(user => user.toObject({ getters: true })) })
}

const signup = async (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new HttpError(
			'Invalid inputs passed, please check your data.',
			422
		)
		return next(error)
	}
	const { name, email, password } = req.body

	let existingUser
	try {
		existingUser = await User.findOne({ email: email })
	} catch (err) {
		const error = new HttpError('Sign up failed, please try again', 500)
		return next(error)
	}
	if (existingUser) {
		const error = new HttpError('user existed already, please login', 422)
		return next(error)
	}
	const createdUser = new User({
		name,
		email,
		password,
		image: 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg',
		places: [],
	})

	try {
		await createdUser.save()
	} catch (err) {
		const error = new HttpError('Sign up failed, plese try again', 500)
		next(error)
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
	const { email, password } = req.body

	let existingUser
	try {
		existingUser = await User.findOne({ email: email })
	} catch (err) {
		const error = new HttpError('Login up failed, please try again', 500)
		return next(error)
	}

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError(
			'Invalid credentials, could not logged in',
			401
		)
		return next(error)
	}

	res.json({
		message: 'Logged in!',
		user: existingUser.toObject({ getters: true }),
	})
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
