/**
 * Retrieve product
* @param {string} category category sended to search
* @param {string} filters user unique id
* 
* @returns {object}
*
* @throws {UnexistenceError} if user dont exists
*/

require('zeroxvisuals-commons/polyfills/string')
const { errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { Product } } = require('zeroxvisuals-data')

module.exports = (category, filter) => {

    String.validate.notVoid(category)

    return (async () => {

        let product

        //TODO filter most viewed (add to db schema) and last added (add to db shcema to)

        switch (filter){
            case 'price-up':
                product = await Product.find({category: category}).sort('price').select('-__v')
                break;
            case 'price-down':
                product = await Product.find({category: category}).sort('-price').select('-__v')
                break;
            case 'stars':
                product = await Product.find({category: category}).sort('-ratesAverage').select('-__v')
                break;
            case 'newest':
                product = await Product.find({category: category}).sort('-Date').select('-__v')
                break;
            case 'views':
                product = await Product.find({category: category}).sort('-views').select('-__v')
                break;
            default:
                product = await Product.find({category: category}).select('-__v')
                break;
        }

        if(!product) throw new UnexistenceError(`product with id: ${userId} dont exists`)

        return product   

    })()
}