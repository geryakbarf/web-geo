const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const {PlaceCategory} = require('../../data/mongo/master');
const dtlib = require('../../libs/datetime');
const moment = require('moment');

const homePage = async (req, res) => {
    const loadJS = [
        {src: '/assets/js/home.js'}
    ];
    try {
        const newPlaces = await Place.find({is_draft: false})
            .limit(4)
            .sort({createdAt: -1})
            .select('name slug photo address');
        const category = await PlaceCategory.find({}).select('name image');
        return res.render('index', {loadJS, newPlaces, category})
    } catch (error) {
        console.log(error);
        return res.send('');
    }

}

const allPlace = async (req, res) => {
    try {
        const allPlaces = await Place.find({is_draft: false})
            .sort({createdAt: -1})
            .select('name slug photo address');
        return res.render('place-all', {allPlaces})
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
        return res.render('place-category', {placeCategory})
    } catch (error) {

    }
}

const claimBusiness = async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js"},
        {src: "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/claim_form.js"},
    ];
    return res.render('claim-business', {loadJS})
}

const placeDetailPage = async (req, res) => {
    try {
        const {slug} = req.params;
        const place = await Place.findOne({is_draft: false, slug});
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
        return res.render('place-detail', {place, menus, day, todayOT, isTodayOpen, lastUpdate, payments, ctas});
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

module.exports = {
    homePage, placeDetailPage, allPlace, claimBusiness, getPlaceCategory
};
