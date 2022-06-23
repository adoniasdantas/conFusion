const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: true
    },
})

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;