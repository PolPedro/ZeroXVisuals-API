const { Schema } = require('mongoose')
const { ObjectId } = require('../../mongoose')
const products = require('./products')

module.exports = new Schema({

    user: {
        type: ObjectId,
        require: true,
        ref: 'User'
    },

    quantity: {
        type: Number,
        default: 0,
        require: true,
    },

    products: [{products}]
     
})