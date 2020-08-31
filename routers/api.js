const express = require('express')

const router = express.Router()
const v1 = express.Router()

const placeCatHandler = require('../handlers/v1/place_categories');
const cuisineHandler = require('../handlers/v1/cuisines');
const paymentHandler = require('../handlers/v1/payments');
const facilityHandler = require('../handlers/v1/facilities');
const covidHandler = require('../handlers/v1/covids');
const placeHandler = require('../handlers/v1/places');
const menuHandler = require('../handlers/v1/menus');
const imageHandler = require('../handlers/v1/images');

v1.get('/place-categories', placeCatHandler.getAll)
v1.get('/cuisines', cuisineHandler.getAll)
v1.get('/payments', paymentHandler.getAll)
v1.get('/facilities', facilityHandler.getAll)
v1.get('/covid-protocols', covidHandler.getAll)

v1.get('/places', placeHandler.getPlaces)
v1.get('/places/:id', placeHandler.getOnePlace)
v1.get('/places/:id/menu-categories', placeHandler.getMenuCategoriesPlace)
v1.put('/places/:id/menu-categories', placeHandler.saveMenuCategoriesPlace)
v1.get('/places/:id/menus', menuHandler.getMenusByPlaceId)
v1.post('/places', placeHandler.createPlace)
v1.put('/places', placeHandler.updatePlace)
v1.delete('/places/:id', placeHandler.deletePlace)

v1.get('/menus', menuHandler.getMenus)
v1.get('/menus/:id', menuHandler.getOneMenu)
v1.post('/menus', menuHandler.createMenu)
v1.put('/menus', menuHandler.updateMenu)
v1.delete('/menus/:id', menuHandler.deleteMenu)

v1.post('/upload-image-s3', imageHandler.uploadImageS3)
v1.delete('/delete-images', imageHandler.deleteImages)

router.use('/v1', v1);

module.exports = router