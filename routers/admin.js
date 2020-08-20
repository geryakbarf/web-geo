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


router.get('/places/new', async (req, res) => {
    const loadJS = [
        {src:"https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src:"https://unpkg.com/@johmun/vue-tags-input@2.1.0/dist/vue-tags-input.js"},
        {src:"/assets/js/admin/form_place.js"},
    ];
    res.render('admin/new-place',{loadJS})
})

module.exports = router