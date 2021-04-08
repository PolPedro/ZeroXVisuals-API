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

        const product = await Product.findById(productId).select('-__v')

        if(!product) throw new UnexistenceError(`product with id: ${productId} dont exists`)

        product.views += 1;
        await product.save()

        return product   

    })()
}