const mongo = require('./index');
const {baseKeyValSchema, baseKeyValSchema} = require('./extra');
const {Schema} = mongo;

const modelName = 'Menu';

const photoSchema = new Schema({
    name: String,
    path: String,
    primary: {type: Boolean, default: false}
});

const coffeeInfoSchema = new Schema({
    label: String,
    infos: [String]
});

const schema = new Schema({
    name: String,
    description: String,
    category: {
        id: Number,
        name: String
    },
    prices: {
        normal_price: Number,
        sale_price: Number,
        sale_price_until: Date
    },
    ingredients: [String],
    coffee_infos: [coffeeInfoSchema],
    photos: [photoSchema],
},{ timestamps:{} });

schema.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true})

const Model = mongo.model(modelName, schema);

module.exports = Model;