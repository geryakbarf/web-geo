const express = require('express');
const adm_auth = require('../middlewares/sess_adm_auth')
const Place = require('../data/mongo/places');
const Menu = require('../data/mongo/menus');
const Admin = require('../data/mongo/admin');

const formPageJS = [
    {src: "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.4/tinymce.min.js"},
    {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
    {src: "https://unpkg.com/@johmun/vue-tags-input@2.1.0/dist/vue-tags-input.js"},
    {src: "https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)"},
    {src: "https://cdn.jsdelivr.net/npm/slugify-js@0.0.2/src/slugify.min.js"},
    {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
    {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
    {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
    {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
    {src: "https://cdn.jsdelivr.net/combine/npm/qrcanvas@3,npm/qrcanvas-vue@2"},
    {src: "https://cdn.jsdelivr.net/npm/vue-easy-tinymce/dist/vue-easy-tinymce.min.js"},
    {src: "/assets/js/admin/form_place.js"},
];
const formPageCSS = [
    {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
]


const router = express.Router()

router.use((req, res, next) => {
    res.locals.title = "Admin | Emam Indonesia"
    next();
});

router.get('/secretadmin', (req, res) => {
    if (req.session.secretadmin) {
        return res.redirect('/admin/secretadmin/add');
    }
    return res.render('secretadmin/login')
})

router.post('/secretadmin/login', (req, res) => {
    const {ADMIN_USER, ADMIN_PASS} = process.env;
    const {email, password} = req.body;
    if (ADMIN_USER === email && ADMIN_PASS === password) {
        req.session.secretadmin = true;
        return res.redirect('/admin/secretadmin/add');
    }
    return res.render('secretadmin/login', {errMsg: "username or password invalid"});
})

router.get('/secretadmin/add', (req, res) => {
    if (!req.session.secretadmin) {
        return res.redirect('/admin/secretadmin/login');
    }
    return res.render('secretadmin/index')
})

router.get('/login', (req, res) => {
    return res.render('admin/login')
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const login = await Admin.findOne({email: email, password: password})
    console.log(login)
    if (login != null) {
        req.session.isAuthenticated = true;
        req.session.admin = login.email;
        //Set Last Login
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let loginDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        const lastLogin = await Admin.update({
            email: email,
            password: password
        }, {$set: {lastLogin: loginDate}})
        //
        return res.redirect('/admin');
    }
    return res.render('admin/login', {errMsg: "username or password invalid"});
})

router.use(adm_auth);

router.get('/', (req, res) => {
    return res.render('admin/index', {})
})

router.get('/logout', (req, res) => {
    delete req.session.isAuthenticated
    delete req.session.admin
    return res.redirect('admin/login')
})

router.get('/places', (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/admin/list_place.js"},
    ];
    const loadCSS = [
        ...formPageCSS
    ]
    return res.render('admin/places', {loadJS, loadCSS, name: req.session.admin})
})

router.get('/owners', (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/admin/list_owner.js"},
    ];
    const loadCSS = [
        ...formPageCSS
    ]
    return res.render('admin/owner', {loadJS, loadCSS, name: req.session.admin})
})

router.get('/places/:id/edit', (req, res) => {
    const {id} = req.params;
    return res.render('admin/edit-place', {loadJS: formPageJS, loadCSS: formPageCSS, id})
})


router.get('/places/new', async (req, res) => {
    return res.render('admin/new-place', {loadJS: formPageJS, loadCSS: formPageCSS})
})

router.get('/places/:placeId/menus/new', async (req, res) => {
    try {
        const {placeId} = req.params;
        const place = await Place.findOne({_id: placeId});
        if (!place) throw {code: 404, message: "Place not found"};
        const loadJS = [
            {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
            {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
            {src: "/assets/js/admin/form_menu.js"},
        ]
        return res.render('admin/new-menu', {loadJS, loadCSS: formPageCSS, placeId})
    } catch (error) {
        return res.redirect('/admin/places');
    }

})

router.get('/places/:placeId/menus/:menuId', async (req, res) => {
    try {
        const {placeId, menuId} = req.params;
        const place = await Place.findOne({_id: placeId});
        if (!place) throw {code: 404, message: "Place not found"};
        const menu = await Menu.findOne({_id: menuId});
        if (!menu) throw {code: 404, message: "Menu not found"};
        const loadJS = [
            {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
            {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
            {src: "/assets/js/admin/form_menu.js"},
        ]
        return res.render('admin/edit-menu', {loadJS, loadCSS: formPageCSS, placeId, menuId})
    } catch (error) {
        return res.redirect('/admin/places');
    }

})

module.exports = router
