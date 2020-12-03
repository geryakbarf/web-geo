const axios = require('axios');
const { API_BACKEND_URL } = process.env;

let headers = { 'Content-Type': "application/json", 'origin': "https://emam.id" };
const showFoodlist = async(req, res) => {

    const { foodListID } = req.params;
    if (req.session.web) {
        const { accessToken } = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, { headers });
    const { data } = resp.data;
    if (resp.status != 200) return res.status(404).render('404');
    if(data.is_private && !data.is_owned) return res.status(404).render('404');
    res.locals.pageTitle = `${data.nama} - Food list emam.id`;

    const loadJS = [
        { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js" },
        { src: "/assets/js/foodlist/detail.js" },
    ]
    res.render("foodlist", { foodlist: data, loadJS });
}

const addPlace = async(req, res) => {
    if(!req.session.web) return res.redirect('/auth');
    res.locals.pageTitle = `Tambah tempat - Food list emam.id`;

    const loadCSS = [
        { src: "https://unpkg.com/vue-select@latest/dist/vue-select.css" },
        { src: "/assets/styles/add-to-foodlist.css" }
    ]
    const loadJS = [
        { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js" },
        { src: "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js" },
        { src: "https://unpkg.com/vue-select@latest" },
        { src: "/assets/js/foodlist/add_to_list.js" },
    ];

    const { foodListID } = req.params;
    
    if (req.session.web) {
        const { accessToken } = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, { headers });
    const { data: foodList } = resp.data;
    if (resp.status != 200) return res.status(404).render('404');


    res.render("add-to-foodlist", { foodList, loadJS, loadCSS });
}


const editPlace = async(req, res) => {
    if(!req.session.web) return res.redirect('/auth');
    const loadJS = [
        { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js" },
        { src: "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js" },
        { src: "/assets/js/foodlist/edit-place.js" },
    ];

    const { foodListID } = req.params;
    const { placeID } = req.query;

    if (req.session.web) {
        const { accessToken } = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, { headers });
    const { data: foodList } = resp.data;
    if (resp.status != 200) return res.status(404).render('404');
    const [place] = foodList.listPlaces.filter(e => e._id == placeID);
    if (!place) return res.status(404).render('404');

    return res.render("edit-place-foodlist", { place, foodList, loadJS });
}
module.exports = {
    showFoodlist,
    addPlace,
    editPlace
}