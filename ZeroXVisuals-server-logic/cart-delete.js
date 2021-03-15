/**
 * Cart delete 
 *
 * @param {string} userId 
 * 
 * @returns {undefined}
 *
 * @throws {UnexistenceError} if cart with id already exists
 */

require('zeroxvisuals-commons/polyfills/string')
const{ errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { Cart, Product } } = require('zeroxvisuals-data')
const {mongoose: {ObjectId}} = require('zeroxvisuals-data')


module.exports = (userId) => {

    String.validate.notVoid(userId)

    return (async () => {

        const cart = await Cart.findOne({user: userId})

        if (!cart) throw new UnexistenceError(`cart with user id:${userId} dont exists`)

        // delete all products in cart

        cart.products.splice(0, cart.products.length)

        cart.quantity = 0

        await cart.save()

})()
}