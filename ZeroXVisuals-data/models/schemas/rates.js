const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const { utils: { Rate } } = require('zeroxvisuals-commons')

module.exports = new Schema({
    userId: {
        type: ObjectId,
        require: true,
        ref: 'User'
    },

    stars: {
        type: Number,
        require: true,
        validate: [Rate.validate, 'invalid rate number']
    },

    date: {
        type: Date,
        require: true
    },

    message : {
        type: String,
    }
})