const express = require('express')

const router = express.Router()

router.use((req,res,next) => {
    res.locals.title = "Admin | Emam Indonesia"
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/places', (req, res) => {
    res.render('admin/places')
})

router.get('/places/new', (req, res) => {
    res.render('admin/new-place')
})

module.exports = router