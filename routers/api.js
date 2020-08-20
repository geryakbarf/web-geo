const express = require('express')

const router = express.Router()
const v1 = express.Router()

const { PlaceCategory, Cuisine, Payment } = require('../data/mongo/master');

v1.get('/place_categories', async(req,res) => {
    let place_categories = await PlaceCategory.find();
    res.json(place_categories);
})

v1.get('/cuisines', async(req,res) => {
    const cuisines = await Cuisine.find();
    res.json(cuisines);
})

v1.get('/payments', async(req,res) => {
    const payments = await Payment.find();
    res.json(payments);
})

router.use('/v1', v1);

module.exports = router