/**
 * Retrieve product
* @param {string} query query sended for the search
* @param {string} filters user unique id
* 
* @returns {object}
*
* @throws {UnexistenceError} if user dont exists
*/

require('zeroxvisuals-commons/polyfills/string')
const { errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { Product } } = require('zeroxvisuals-data')

module.exports = (words, filter) => {

    String.validate.notVoid(words)

    return (async () => {

        let product

        //TODO filter most viewed (add to db schema) and last added (add to db shcema to)

        switch (filter){
            case 'price-up':
                product = await Product.find( { "name": {"$regex": `${words}`, "$options": "i", } }).sort('price').select('-__v')
                break;
            case 'price-down':
                product = await Product.find( { "name": {"$regex": `${words}`, "$options": "i", } }).sort('-price').select('-__v')
                break;
            case 'stars':
                product = await Product.find( { "name": {"$regex": `${words}`, "$options": "i", } }).sort('-ratesAverage').select('-__v')
                break;
            case 'newest':
                product = await Product.find( { "name": {"$regex": `${words}`, "$options": "i", } }).sort('-Date').select('-__v')
                break;
            case 'views':
                product = await Product.find( { "name": {"$regex": `${words}`, "$options": "i", } }).sort('-views').select('-__v')
                break;
            default:
                product = await Product.find( { "name": {"$regex": `${words}`, "$options": "i", } }).select('-__v')
                break;
        }

        if(!product) throw new UnexistenceError(`product with id: ${userId} dont exists`)

        return product   

    })()
}