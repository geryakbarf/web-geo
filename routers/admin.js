const express = require('express');

const Place = require('../data/mongo/places');
const Menu = require('../data/mongo/menus');

const formPageJS = [
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
const formPageCSS = [
    {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
]


const router = express.Router()

router.use((req,res,next) => {
    res.locals.title = "Admin | Emam Indonesia"
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/places', (req, res) => {
    const loadJS = [
        {src:"https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src:"https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src:"https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src:"https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src:"/assets/js/admin/list_place.js"},
    ];
    const loadCSS = [
        ...formPageCSS
    ]
    res.render('admin/places', {loadJS, loadCSS})
})

router.get('/places/:id/edit', (req, res) => {
    const { id } = req.params;
    res.render('admin/edit-place',{loadJS: formPageJS, loadCSS: formPageCSS, id})
})


router.get('/places/new', async (req, res) => {
    
    res.render('admin/new-place', {loadJS: formPageJS, loadCSS: formPageCSS})
})

router.get('/places/:placeId/menus/new', async (req, res) => {
    try {
        const { placeId } = req.params;
        const place = await Place.findOne({_id: placeId});
        if(!place) throw {code: 404, message: "Place not found"};
        const loadJS = [
            {src:"https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
            {src:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
            {src:"https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
            {src:"https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
            {src:"/assets/js/admin/form_menu.js"},
        ]
        res.render('admin/new-menu', {loadJS, loadCSS: formPageCSS, placeId})    
    } catch (error) {
        res.redirect('/admin/places');
    }
    
})

router.get('/places/:placeId/menus/:menuId', async (req, res) => {
    try {
        const { placeId, menuId } = req.params;
        const place = await Place.findOne({_id: placeId});
        if(!place) throw {code: 404, message: "Place not found"};
        const menu = await Menu.findOne({_id: menuId});
        if(!menu) throw {code: 404, message: "Menu not found"};
        const loadJS = [
            {src:"https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
            {src:"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
            {src:"https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
            {src:"https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
            {src:"/assets/js/admin/form_menu.js"},
        ]
        res.render('admin/edit-menu', {loadJS, loadCSS: formPageCSS, placeId, menuId})    
    } catch (error) {
        res.redirect('/admin/places');
    }
    
})

module.exports = router