const mongo = require('./index');
const {Schema} = mongo;

const PlaceCatSchema = new Schema({
    name: String,
},{ timestamps:{} });

const PlaceCategory = mongo.model('PlaceCategory', PlaceCatSchema);

const CuisineSchema = new Schema({
    name: String,
},{ timestamps:{} });

const Cuisine = mongo.model('Cuisine', CuisineSchema);

const PaymentSchema = new Schema({
    code: Number,
    name: String,
},{ timestamps:{} });

const Payment = mongo.model('Payment', PaymentSchema);

const FacilitySchema = new Schema({
    name: String,
    options: Schema.Types.Mixed
},{ timestamps:{} });

const Facility = mongo.model('Facility', FacilitySchema);

const CovidProtSchema = new Schema({
    name: String,
    options: Schema.Types.Mixed
},{ timestamps:{} });

const CovidProtocol = mongo.model('CovidProtocol', CovidProtSchema);

module.exports = {
    PlaceCategory,
    Cuisine,
    Payment,
    Facility,
    CovidProtocol
};