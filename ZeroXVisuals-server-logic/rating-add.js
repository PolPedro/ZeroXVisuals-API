/**
 * add rating to the products
 *
 * @param {string} productId 
 * @param {string} userId 
 * @param {integer} stars 
 * @param {string} message 
 * 
 * @returns {undefined}
 *
 * @throws {UnexistenceError} if user dont exist
 */

require('zeroxvisuals-commons/polyfills/string')
require('zeroxvisuals-commons/polyfills/number')
const { models: {Rate, Product}} = require('zeroxvisuals-data')
const { errors: { UnexistenceError } } = require('zeroxvisuals-commons')

module.exports = (productId, userId, stars, message) => {

    String.validate.notVoid(productId)
    String.validate.notVoid(userId)
    Number.validate.integer(stars)
    String.validate.notVoid(message)

    return (async () => {
        let commented = false
        let product = await Product.findById(productId)
        
        if (!product) throw new UnexistenceError(`product with id ${productId} dont exists`)

        //see if user has already a rate on this product

        for(var i in product.rates){
            if(product.rates[i].userId.toString() === userId){
                commented = true
                product.ratesAverage = ((((product.ratesAverage * product.rates.length) - product.rates[i].stars) + stars) / (product.rates.length))
                product.rates[i].stars = stars
                product.rates[i].message = message
                product.rates[i].date = new Date
                break
            }
        }

        if(commented === false){
            product.rates.unshift(
                new Rate({
                    userId,
                    stars,
                    message,
                    date: new Date
                })
            )
            product.ratesAverage = (((product.ratesAverage * (product.rates.length - 1)) + stars) / (product.rates.length))
        }

        await product.save()

    })()
}