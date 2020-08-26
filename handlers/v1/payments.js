const { Payment } = require('../../data/mongo/master');

const getAll = async(req,res) => {
    const payments = await Payment.find();
    res.json(payments);
}

module.exports = {
    getAll
}