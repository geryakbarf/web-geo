const mongo = require('./index');
const mongoose_delete = require('mongoose-delete');
const {baseTypeValSchema} = require('./extra');
const {Schema} = mongo;
const modelName = 'Place';

const facilitySchema = new Schema({
    name: String,
    options: Schema.Types.Mixed
});
const callToActionSchema = new Schema(baseTypeValSchema);

const gallerySchema = new Schema({
    category: String,
    path: String,
    options: Schema.Types.Mixed
});

const operationalTimeSchema = new Schema({
    day: String,
    openTime: String,
    closeTime: String,
    is_open: Boolean,
    options: Schema.Types.Mixed
});

const schema = new Schema({
    name: String,
    slug: {type: String, unique: true},
    description: String,
    city: String,
    address: String,
    cuisines: [String],
    type: String,
    is_partner: Boolean,
    is_draft: Boolean,
    is_halal: Boolean,
    payments: Schema.Types.Mixed,
    photo: {
        path: String,
        options: Schema.Types.Mixed
    },
    menu_categories: [String],
    operational_times: [operationalTimeSchema],
    facilities: [facilitySchema],
    call_to_actions: [callToActionSchema],
    galleries: [gallerySchema],
    covid: [String]
},{ timestamps:{} });

schema.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true})

const Model = mongo.model(modelName, schema);

module.exports = Model;