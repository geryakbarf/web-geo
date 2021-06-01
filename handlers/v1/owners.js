const Place = require('../../data/mongo/places');
const Owner = require('../../data/mongo/places_owner');

const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin.";

const getAllOwners = async (req, res) => {
    try {
        let data = await Owner.find();
        data = data.map(e => {
            let doc = e._doc
            doc.updatedAt = moment(doc.updatedAt).format("YYYY-MM-DD HH:mm")
            return doc;
        });

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