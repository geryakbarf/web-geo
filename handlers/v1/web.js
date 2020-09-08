const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
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
        return res.render('index', {loadJS, newPlaces})
    } catch (error) {
        console.log(error);
        return res.send('');
    }

}

const _searchMenus = async (keyword) => {
    try {
        const menus = await Menu.find({$text: {$search: keyword}}).limit(5).select('placeId name photo _id');
        const places = await Place.find({_id: { $in: menus.map(e => (e.placeId)) }}).select('name slug _id');
        const results = menus.map( e => {
            let {_id, name, placeId, photo} = e;
            // name = _boldStringHtml(name, keyword);
            let [place] = places.filter( e1 => (e1._id == placeId));
            // place.name = _boldStringHtml(place.name, keyword);
            return {_id, name, photo, placeName: place.name, slug: place.slug};
        })
        return Promise.resolve(results);
    } catch (error) {
        return Promise.reject(error);
    }
}


const allPlace = async (req, res) => {
    const loadJS = [
        {src: '/assets/js/home.js'}
    ];
    try {
        const {search_place, search_menu} = req.query;
        let filter = {is_draft: false};
        let allMenus = [];
        if(search_place) filter['$text'] = { $search: search_place };
        let allPlaces = await Place.find(filter)
            .sort({createdAt: -1})
            .select('name slug photo address');
        if(search_menu) {
            allMenus = await _searchMenus(search_menu);
            allPlaces = [];
        }
        return res.render('place-all', {loadJS, allPlaces, allMenus})
    } catch (error) {
        console.log(error);
        return res.send('');
    }
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
    homePage, placeDetailPage, allPlace
};
