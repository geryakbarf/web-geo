const Place = require('../../data/mongo/places');
const Owner = require('../../data/mongo/places_owner');

const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin.";

const getAllOwners = async (req, res) => {
    try {
        let data = await Owner.find();
        let place = await Place.find();
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            return doc;
        });
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            let date = new Date(Date.parse(data[i].updatedAt) + 12096e5)
            data[i].nextUpdate = moment(date).format("YYYY-MM-DD HH:mm")
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

const addOwner = async (req, res) => {
    try {
        const owner = await Owner.create(req.body);
        const data = await Owner.findOne({slug: owner._id});
        return res.json({
            message: "Sukses menambahkan owner",
            data: {id: data._id}
        });
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

module.exports = {
    getAllOwners,
    addOwner
}