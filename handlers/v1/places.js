const Place = require('../../data/mongo/places');

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
        res.status(500).json({
            message: "Terjadi kesalahan, mohon hubungi admin."
        })
    }
    
}

module.exports = {
    createPlace
}