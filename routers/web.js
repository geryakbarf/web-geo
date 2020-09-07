const express = require('express')
const imageHandler = require('../handlers/v1/images');
const common = require('../middlewares/common');
const router = express.Router()

router.get('/coming-soon', (req, res) => {
    res.render('coming-soon')
})

router.use(common.commingsoon)

router.get('/', (req, res) => {
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

router.get('/p/:slug', (req, res) => {
    res.render('place-detail')
})

router.get('/about', (req, res) => {
    res.redirect('/under-construction')
})

router.get('/blog', (req, res) => {
    res.redirect('/under-construction')
})

router.get('/business', (req, res) => {
    res.redirect('/under-construction')
})

router.get('/contact-us', (req, res) => {
    res.redirect('/under-construction')
})

router.get('/sitemap', (req, res) => {
    res.redirect('/under-construction')
})

router.get('/under-construction', (req, res) => {
    res.render('underconstruction')
})

router.get('/images/:key', imageHandler.getImage)

module.exports = router