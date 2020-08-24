const express = require('express')

const router = express.Router()
const v1 = express.Router()

const placeCatHandler = require('../handlers/v1/place_categories');
const cuisineHandler = require('../handlers/v1/cuisines');
const paymentHandler = require('../handlers/v1/payments');
const facilityHandler = require('../handlers/v1/facilities');
const covidHandler = require('../handlers/v1/covids');
const placeHandler = require('../handlers/v1/places');

v1.get('/place-categories', placeCatHandler.getAll)
v1.get('/cuisines', cuisineHandler.getAll)
v1.get('/payments', paymentHandler.getAll)
v1.get('/facilities', facilityHandler.getAll)
v1.get('/covid-protocols', covidHandler.getAll)

v1.post('/places', placeHandler.createPlace)

router.use('/v1', v1);

module.exports = router