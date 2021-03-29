/**
* Payement receive
*
* @param {object} body 
* 
* @returns {undefined}
*
* @throws {UnexistenceError} if cart with id already exists
*/

require('zeroxvisuals-commons/polyfills/string')
const cartDelte = require('./cart-delete')
const{ errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { User } } = require('zeroxvisuals-data')
 
module.exports = (body) => {

    //TODO search users cart and add products to user productbuyed, look if we can pass the products ids in body show we dont have to search cart

    return (async () => {
    
        const userId = body.data.object.client_reference_id

        const user = await User.findById(userId)
        if(!user) throw new UnexistenceError(`user with id: ${userId} dosent exists`)

        // || retrive products ids and save them in user poductsbuy ||
        
        for (var i in body.data.object.metadata){
            user.productsbuy.push(body.data.object.metadata[i])
        }

        await user.save()

        // || Delete users cart after checkout ||

        await cartDelte(userId)
})()
}