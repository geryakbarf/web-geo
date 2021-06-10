const mongo = require('./index');
const {Schema} = mongo;
const modelName = 'Owner';

const adminSchema = new Schema({
    name: String,
    contact: String,
    subscription: String,
    lastUpdate: String,
    placesId: [String],
    contactType: String,
    contactNumber: String,
    addons: String,
    options: Schema.Types.Mixed
}, {timestamps: {}});

const Model = mongo.model(modelName, adminSchema);

module.exports = Model;
