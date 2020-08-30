const Place = require('../../data/mongo/places');

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
        const data = await Place.find();
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

const deletePlace = async(req, res) => {
    try {
        await Place.deleteOne({_id: req.params.id});
        return res.json({message: "Success to delete places"})
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
    deletePlace
}