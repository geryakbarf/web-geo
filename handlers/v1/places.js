const Place = require('../../data/mongo/places');
const Menu = require('../../data/mongo/menus');
const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin."

const createPlace = async(req,res) => {
    try {
        const place = await Place.create(req.body);
        return res.json({
            message: "Success to create place",
            data: {id: place._id}
        });    
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
    
}

const updatePlace = async(req,res) => {
    try {
        const {_id, ...data} = req.body;
        const place = await Place.updateOne({_id}, data);
        return res.json({
            message: "Success to update place",
            data: {id: place._id}
        });    
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
    
}

const getPlaces = async(req, res) => {
    try {
        let data = await Place.find();
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            return doc;
        })
        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getOnePlace = async(req, res) => {
    try {
        const data = await Place.findOne({_id: req.params.id});
        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getMenuCategoriesPlace = async(req, res) => {
    try {
        let data = await Place.findOne({_id: req.params.id});
        data = data.menu_categories ? data.menu_categories: []; 
        return res.json({message: "Success to retrive menu categories", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const deletePlace = async(req, res) => {
    try {
        const place = await Place.findOne({_id: req.params.id});
        await place.delete();
        return res.json({message: "Success to delete places"})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const saveMenuCategoriesPlace = async(req, res) => {
    try {
        const {categories} = req.body;
        const place = await Place.findOne({_id: req.params.id});
        if(!place) throw {code: 404, message:"Place not found"};
        place.menu_categories = categories;
        await place.save();
        return res.json({message: "Success to save menu categories"})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const _boldStringHtml = (str, strBolded) => {
    const searchMask = strBolded;
    const regEx = new RegExp(searchMask, "ig");
    const replaceMask = `<strong>${strBolded}</strong>`;

    return str.replace(regEx, replaceMask);
}

const _searchMenuPlace = async (keyword) => {
    try {
        const menus = await Menu.find({$text: {$search: keyword}}).limit(5).select('placeId name photo _id');
        const places = await Place.find({_id: { $in: menus.map(e => (e.placeId)) }}).select('name slug _id');
        const results = menus.map( e => {
            let {name, placeId, photo, _id} = e;
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

const searchPlacesAndMenus = async(req, res) => {
    try {
        const { keyword } = req.query;
        const placesQuery = Place.find({$text: {$search: keyword}}).limit(5).select('name slug address photo');
        const menusQuery = _searchMenuPlace(keyword);
        let [places, menus] = await Promise.all([placesQuery, menusQuery]);
        return res.render('partials/search-bar-place', {places, menus, keyword});
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});

    }
}

module.exports = {
    getPlaces,
    getOnePlace,
    createPlace,
    updatePlace,
    deletePlace,
    getMenuCategoriesPlace,
    saveMenuCategoriesPlace,
    searchPlacesAndMenus
}