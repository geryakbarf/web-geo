const express = require('express')
const imageHandler = require('../handlers/v1/images');
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users')
})

router.get('/images/:key', imageHandler.getImage)

module.exports = router