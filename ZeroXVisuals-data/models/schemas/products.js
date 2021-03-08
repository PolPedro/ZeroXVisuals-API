const { Schema } = require('mongoose')
const rates = require('./rates')

module.exports = new Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
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

    rates : [rates]
     
})