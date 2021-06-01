const mongo = require('./index');
const {Schema} = mongo;
const modelName = 'Owner';

const adminSchema = new Schema({
    name: String,
    contact: String,
    subscription: String,
    addon: String,
    lastUpdate: String,
    placesId: [String],
    placeName: String,
    options: Schema.Types.Mixed
}, {timestamps: {}});

const Model = mongo.model(modelName, adminSchema);

module.exports = Model;
