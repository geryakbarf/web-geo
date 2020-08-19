const mongo = require('./index');
const mongoose_delete = require('mongoose-delete');
const {baseKeyValSchema, baseKeyValSchema} = require('./extra');
const {Schema} = mongo;
const modelName = 'Place';

const facilitySchema = new Schema(baseKeyValSchema);
const mediaSchema = new Schema(baseTypeValSchema);
const callToActionSchema = new Schema(baseTypeValSchema);
const covidSchema = new Schema({
    protocol_type: String,
    is_implement: Boolean
});
const gallerySchema = new Schema({
    name: String,
    category: String,
    path: String
});

const schema = new Schema({
    name: String,
    slug: {type: String, unique: true},
    description: String,
    city: String,
    cuisines: [String],
    type: [String],
    facilities: [facilitySchema],
    medias: [mediaSchema],
    call_to_actions: [callToActionSchema],
    galleries: [gallerySchema],
    covid: [covidSchema]
},{ timestamps:{} });

schema.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true})

const Model = mongo.model(modelName, schema);

module.exports = Model;