/**
 * Retrieve User
* @param {string} userId user unique id
* 
* @returns {object}
*
* @throws {UnexistenceError} if user dont exists
*/

require('zeroxvisuals-commons/polyfills/string')
require('zeroxvisuals-commons/polyfills/json')
const { errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { User } } = require('zeroxvisuals-data')

module.exports = (userId) => {

    String.validate.notVoid(userId)

    return (async () => {
        
        let user 

        user = await User.findById(userId).select('-password -__v').lean()

        if(!user) throw new UnexistenceError(`user with id: ${userId} dont exists`)

        return user   

    })()
}