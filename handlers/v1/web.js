const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const dtlib = require('../../libs/datetime');
const moment = require('moment');
const homePage = async(req, res) => {
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


const placeDetailPage = async(req, res) => {
    try {
        const {slug} = req.params;
        const place = await Place.findOne({is_draft: false, slug});
        let menus = await Menu.find({placeId: place._id});
        menus = place.menu_categories.map(e => {
            let menu_docs = menus.filter(e1 => (e == e1.category));
            return {category: e, menus: menu_docs};
        });
        const day = dtlib.getTodayId();
        const [todayOT] = place.operational_times.filter(e => (e.day == day));
        const isTodayOpen = dtlib.isPlaceOpen(todayOT);
        const lastUpdate = moment(place.updatedAt).format(dtlib.formats.lastUpdate);
        let payments = place.payments.map(e => (e.name));
        let ctas = {};
        place.call_to_actions.forEach(e => {
            if(e.value != '') ctas[e.type] = e.value;
        })
        payments = payments.length > 0 ? payments.join(', ') : 'Belum ada informasi'; 
        return res.render('place-detail', {place, menus, day, todayOT, isTodayOpen, lastUpdate, payments, ctas});  
    } catch (error) {
        console.log(error);
        return res.send('');
    }
}

module.exports = {
    homePage, placeDetailPage
};