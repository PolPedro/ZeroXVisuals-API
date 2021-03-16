/**
 * Cart add
 *
 * @param {string} userId 
 * @param {string} productId 
 * 
 * @returns {undefined}
 *
 * @throws {UnexistenceError} if cart with id already exists
 */

 require('zeroxvisuals-commons/polyfills/string')
 const{ errors: { UnexistenceError } } = require('zeroxvisuals-commons')
 const { models: { Cart, Product } } = require('zeroxvisuals-data')
 const {mongoose: {ObjectId}} = require('zeroxvisuals-data')
 
 
 module.exports = (userId, productId) => {

    String.validate.notVoid(userId)
    String.validate.notVoid(productId)
 
    return (async () => {

        //TODO no permitir que se pueda coger 2 veces el mismo prouducto

        const cart = await Cart.findOne({user: userId})

        if (!cart) throw new UnexistenceError(`cart with user id:${userId} dont exists`)

        const product = await Product.findById(productId)

        if (!product) throw new UnexistenceError(`product with id:${productId} dont exists`)

        cart.products.unshift(productId)

        cart.quantity += 1

        await cart.save()

    })()
 }