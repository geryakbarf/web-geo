const axios = require('axios');
const { API_BACKEND_URL } = process.env;
const showFoodlist = async(req, res) => {
    const { foodListID } = req.params;
    let headers = { 'Content-Type': "application/json" };
    if (req.session.web) {
        const { accessToken } = req.session.web;
        if (accessToken) headers.authorization = "Bearer " + accessToken;
    }
    const resp = await axios.get(`${API_BACKEND_URL}/v1/foodlist-detail?foodlistID=${foodListID}`, { headers });
    const { data } = resp.data;
    if (resp.status != 200) return res.status(404).render('404');
    res.locals.pageTitle = `${data.nama} - Food list emam.id`;

    const loadJS = [
        { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js" },
        { src: "/assets/js/foodlist/detail.js" },
    ]
    res.render("foodlist", { foodlist: data, loadJS });
}

const addPlace = async(req, res) => {
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
    ]

    const { foodListID } = req.params

    res.render("add-to-foodlist", { foodListID, loadJS, loadCSS });
}
module.exports = {
    showFoodlist,
    addPlace
}