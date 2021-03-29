const { Schema } = require('mongoose')
const rate = require('./rates')

module.exports = new Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        require: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    Date: {
        type: Date,
        default: new Date
    },

    rates : [rate],

    ratesAverage: {
        type: Number,
        default: null
    },

    views: {
        type: Number,
        default: 0
    }
     
})