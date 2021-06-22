const HttpError = require('../models/http-error')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // ensure the request is not blocked by OPTIONS:
    if (req.method === 'OPTIONS') {
        return next()
    }
	try {
		const token = req.headers.authorization.split(' ')[1]

		if (!token) {
			throw new Error('Authentication failed')
		}
		const decodedToken = jwt.verify(token, 'super_secret_key')
        // add data to the request:
		req.userData = { userId: decodedToken.userId }
        // allow to reach to below routers
        next()
	} catch (err) {
		const error = new HttpError('Authentication failed', 401)
		return next(error)
	}
}
