const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const {PlaceCategory} = require('../../data/mongo/master');
const dtlib = require('../../libs/datetime');
const moment = require('moment');

const homePage = async (req, res) => {
    res.locals.pageTitle = "Kulineran aman dengan menu digital - emam.id"
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/npm/vuejs-datatable@2.0.0-alpha.7/dist/vuejs-datatable.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: '/assets/js/home.js'}
    ];
    try {
        const newPlaces = await Place.find({is_draft: false})
            .limit(4)
            .sort({createdAt: -1})
            .select('name slug photo address');
        const category = await PlaceCategory.find({}).limit(4).select('name image');
        const allCategory = await PlaceCategory.find({}).select('name image');
        return res.render('index', {loadJS, newPlaces, category, allCategory, path: req.route.path})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const categoryPage = async (req, res) => {
    try {
        const category = await PlaceCategory.find({}).select('name image');
        res.locals.pageTitle = "Explore kategori tempat makan - emam.id"
        return res.render('all-category', {category})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const _searchMenus = async (keyword) => {
    try {
        const menus = await Menu.find({$text: {$search: keyword}}).limit(5).select('placeId name photo _id');
        const places = await Place.find({_id: {$in: menus.map(e => (e.placeId))}}).select('name slug _id');
        const results = menus.map(e => {
            let {_id, name, placeId, photo} = e;
            // name = _boldStringHtml(name, keyword);
            let [place] = places.filter(e1 => (e1._id == placeId));
            // place.name = _boldStringHtml(place.name, keyword);
            return {_id, name, photo, placeName: place.name, slug: place.slug};
        })
        return Promise.resolve(results);
    } catch (error) {
        return Promise.reject(error);
    }
}


const allPlace = async (req, res) => {
    try {
        const {search_place, search_menu} = req.query;
        let filter = {is_draft: false};
        let allMenus = [];
        if (search_place) filter['$text'] = {$search: search_place};
        let allPlaces = await Place.find(filter)
            .sort({createdAt: -1})
            .select('name slug photo address');
        if (search_menu) {
            allMenus = await _searchMenus(search_menu);
            allPlaces = [];
        }
        res.locals.pageTitle = "Explore tempat makan - emam.id"
        return res.render('place-all', {allPlaces, allMenus})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

const getPlaceCategory = async (req, res) => {
    try {
        const {category} = req.params
        const placeCategory = await Place.find({is_draft: false, "categories.name": category})
            .sort({createdAt: -1})
            .select('name slug photo address');
        res.locals.pageTitle = "Explore " + category + " - emam.id";
        return res.render('place-category', {placeCategory, category})
    } catch (error) {

    }
}

const claimBusiness = async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"},
        {src: "https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.min.js"},
        {src: "https://unpkg.com/sweetalert/dist/sweetalert.min.js"},
        {src: "/assets/js/claim_form.js"},

    ];
    res.locals.pageTitle = "Klaim tempat makan - emam.id"
    const {slug} = req.params;

    try {
        const place = await Place.findOne({is_draft: false, slug});
        if (!place) throw {code: 404, message: "404 Not Found"};
        return res.render('claim', {loadJS, place})
    } catch (error) {
        console.log(error);
        if (error.code == 404)
            return res.status(error.code).send(error.message)
        return res.send('');
    }
}

const placeDetailPage = async (req, res) => {
    const loadJS = [
        {src: "https://unpkg.com/swiper/swiper-bundle.min.js"},
        {src: "/assets/js/side-nav-bar.js"},
        {src: "/assets/js/place-detail.js"}
    ];
    const loadCSS = [
        {src: "https://unpkg.com/swiper/swiper-bundle.min.css"},
        {src: "/assets/styles/side-nav-bar.css"},
    ];
    try {
        const {slug} = req.params;
        const place = await Place.findOne({is_draft: false, slug});
        if (!place) throw {code: 404, message: "404 Not Found"};
        let menus = await Menu.find({placeId: place._id});
        menus = place.menu_categories.map(e => {
            let menu_docs = menus.filter(e1 => (e == e1.category)).map(e1 => {
                let doc = e1._doc;
                doc.prices.normal_price = new Intl.NumberFormat().format(doc.prices.normal_price).replace(',', '.');
                doc.prices.sale_price = new Intl.NumberFormat().format(doc.prices.sale_price).replace(',', '.');
                return doc;
            });
            return {category: e, menus: menu_docs};
        }).filter(e => (e.menus.length > 0));
        const day = dtlib.getTodayId();
        const [todayOT] = place.operational_times.filter(e => (e.day == day));
        const isTodayOpen = dtlib.isPlaceOpen(todayOT);
        const lastUpdate = moment(place.updatedAt).format(dtlib.formats.lastUpdate);
        let payments = place.payments.map(e => (e.name));
        let ctas = {};
        place.call_to_actions.forEach(e => {
            if (e.value != '') ctas[e.type] = e.value;
        })
        payments = payments.length > 0 ? payments.join(', ') : 'Belum ada informasi';
        const city = place.city.charAt(0).toUpperCase() + place.city.slice(1);
        res.locals.pageTitle = place.name + ", " + city + " - Info menu digital terbaru dari emam.id"
        return res.render('place-detail', {
            place,
            menus,
            day,
            todayOT,
            isTodayOpen,
            lastUpdate,
            payments,
            ctas,
            loadJS,
            loadCSS
        });
    } catch (error) {
        console.log(error);
        if (error.code == 404)
            return res.status(error.code).send(error.message)
        return res.send('');
    }
}

module.exports = {
    homePage, placeDetailPage, allPlace, claimBusiness, getPlaceCategory, categoryPage
};
