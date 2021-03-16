/**
* Retrieve Cart
* @param {string} userId user unique id
* 
* @returns {object}
*
* @throws {UnexistenceError} if user dont exists
*/

require('zeroxvisuals-commons/polyfills/string')

const { errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { Cart } } = require('zeroxvisuals-data')

module.exports = (userId) => {

    String.validate.notVoid(userId)

    return (async () => {

        //find and populate users cart excluding the ratings

        const cart = await Cart.findOne({user: userId}).select('-__v').populate({path: 'products', select: '-__v -rates'}).lean()

        if(!cart) throw new UnexistenceError(`cart with user id: ${userId} dont exists`)

        return cart   

    })()
}