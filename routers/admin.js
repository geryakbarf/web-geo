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
        {src:"https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)"},
        {src:"https://cdn.jsdelivr.net/npm/slugify-js@0.0.2/src/slugify.min.js"},
        {src:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
        {src:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
        {src:"https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src:"https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src:"/assets/js/admin/form_place.js"},
    ];
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ]
    res.render('admin/new-place',{loadJS, loadCSS})
})

module.exports = router