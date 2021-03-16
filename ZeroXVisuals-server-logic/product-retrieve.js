/**
 * Retrieve product
* @param {string} productId user unique id
* 
* @returns {object}
*
* @throws {UnexistenceError} if user dont exists
*/

require('zeroxvisuals-commons/polyfills/string')
const { errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { Product } } = require('zeroxvisuals-data')

module.exports = (productId) => {

    String.validate.notVoid(productId)

    return (async () => {

        const product = await Product.findById(productId).select('-__v').lean()

        if(!product) throw new UnexistenceError(`product with id: ${userId} dont exists`)

        return product   

    })()
}