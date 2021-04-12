const { Schema } = require('mongoose')
const { utils: { Email } } = require('zeroxvisuals-commons')
const { ObjectId } = require('../../mongoose')

module.exports = new Schema({

    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [Email.validate, 'invalid e-mail']
    },

    password: {
        type: String,
        required: true
    },

    cart: {
        type: ObjectId,
        ref: 'Cart'
    },

    stripeCustomer : {
        type: String
    },

    productsbuy : [{
        type: ObjectId, ref:'Product'
    }],

    ips: [{
        type: String
    }]
})