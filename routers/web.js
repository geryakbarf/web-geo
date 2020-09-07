const express = require('express')
const imageHandler = require('../handlers/v1/images');
const common = require('../middlewares/common');
const router = express.Router()

router.get('/', common.commingsoon, (req, res) => {
    const loadJS = [
        {src: '/assets/js/home.js'}
    ]
    res.render('index', {loadJS})
})

router.post('/fetch_food.php', (req, res) => {
    res.send(`
    <div class="show-search" align="left">
        <a href="detailtempat.php?id=Didago-Cafe-Dago-Bandung">
            <img src="https://emam.id/images/database/tempatmakan/emam-didago-cover.png" style="width:50px; height:50px; float:left; margin-right:6px;" />
            <div class="text-info-tempat" style=""><span class="name">Di<strong>dago</strong> Cafe</span>&nbsp;<br />Jl. Ir. H. Juanda No.21, Kota Bandung (setelah DEKRANASDA Jawa Barat)<br /></div>
        </a>
    </div>

    `)
})

router.get('/p/:slug', common.commingsoon, (req, res) => {
    res.render('place-detail')
})

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

router.get('/images/:key', imageHandler.getImage)

module.exports = router