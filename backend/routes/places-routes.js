const express = require('express')
const { check } = require('express-validator')

const placesControllers = require('../controllers/places-controllers')
const { getPlaceById, getPlacesByUserId, updatePlace, deletePlace } = placesControllers

const fileUpload = require('../middleware/file-upload')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
router.get('/:pid', getPlaceById)

router.get('/user/:uid', getPlacesByUserId)

router.use(checkAuth)

router.post(
	'/',
	fileUpload.single('image'),
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 }),
		check('address').not().isEmpty(),
	],
	placesControllers.createPlace
)

router.patch(
	'/:pid',
	[check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
	updatePlace
)

router.delete('/:pid', deletePlace)

module.exports = router
