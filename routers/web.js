const express = require('express')
const imageHandler = require('../handlers/v1/images');
const placeHandler = require('../handlers/v1/places');
const common = require('../middlewares/common');
const web = require('../handlers/v1/web');
const router = express.Router()

router.get('/', common.commingsoon, web.homePage)

router.get('/explore', web.allPlace)

router.get('/search-places', placeHandler.searchPlacesAndMenus)
router.get('/claim', web.claimBusiness)
router.get('/explore/category/:category', web.getPlaceCategory)
router.get('/explore/category', web.categoryPage)

router.get('/about', common.commingsoon, (req, res) => {
    res.redirect('/under-construction')
})

router.get('/blog', common.commingsoon, (req, res) => {
    res.redirect('/under-construction')
})

router.get('/business', common.commingsoon, (req, res) => {
    res.redirect('/under-construction')
})

router.get('/contact-us', common.commingsoon, (req, res) => {
    res.redirect('/under-construction')
})

router.get('/under-construction', common.commingsoon, (req, res) => {
    res.render('underconstruction')
})

router.get('/coming-soon', (req, res) => {
    res.render('coming-soon')
})

router.get('/p/:slug', common.commingsoon, web.placeDetailPage)

router.get('/images/:key', imageHandler.getImage)

module.exports = router
