const Place = require('../../data/mongo/places');
const { response } = require('express');

const createPlace = async(req,res) => {
    try {
        const place = await Place.create(req.body);
        res.json({
            message: "Success to create place",
            data: {
                id: place._id
            }
        });    
    } catch (error) {
        console.log(error);
        res.json({
            message: "Terjadi kesalahan, mohon hubungi admin."
        })
    }
    
}

module.exports = {
    createPlace
}