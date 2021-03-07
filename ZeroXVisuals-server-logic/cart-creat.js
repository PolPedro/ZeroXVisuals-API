/**
 * Register User
 *
 * @param {string} userId users name
 * 
 * @returns {undefined}
 *
 * @throws {DuplicityError} if cart with id already exists
 */

require('zeroxvisuals-commons/polyfills/string')
const{ errors: { DuplicityError } } = require('zeroxvisuals-commons')
const { models: { Cart } } = require('zeroxvisuals-data')
const {mongoose: {ObjectId}} = require('zeroxvisuals-data')


module.exports = (userId) => {

    return (async () => {
        const cart = await Cart.findOne({user: userId})

        if (cart) throw new DuplicityError(`the cart for this user already exists`)

        await Cart.create({ user: ObjectId(userId) })
    })()
}