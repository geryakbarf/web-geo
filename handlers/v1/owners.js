const Place = require('../../data/mongo/places');
const Owner = require('../../data/mongo/places_owner');

const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin.";

const getAllOwners = async (req, res) => {
    try {
        let data = await Owner.find();
        let place = await Place.find();
        let date = new Date(Date.parse(data[0].updatedAt) + 12096e5)
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            doc.nextUpdate = moment(date).format("YYYY-MM-DD HH:mm")
            return doc;
        });
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < place.length; j++) {
                if (data[i].placesId[0] == place[j]._id)
                    data[i].placeName = place[j].name
            }
        }

        return res.json({message: "Success to retrive places", data})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

module.exports = {
    getAllOwners
}