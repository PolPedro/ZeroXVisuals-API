/**
 * Updates the user params recieved in body
 *
 * @param {string} userId 
 * @param {object} body 
 * 
 * @returns {undefined}
 *
 * @throws {UnexistenceError} if user dont exist
 */

require('zeroxvisuals-commons/polyfills/string')
require('zeroxvisuals-commons/polyfills/json')
const { utils: {Email}, errors: { UnexistenceError } } = require('zeroxvisuals-commons')
const { models: { User }, mongoose } = require('zeroxvisuals-data')

//TODO mejorar el upgrade para que sea mas modular

module.exports = (userId, body) => {

    String.validate.notVoid(userId)

    return (async () => {
        
        let paramExists = false

        const user = await User.findById(userId).select('-password -__v')
        if (!user) throw new UnexistenceError(`user with id ${userId} dont exists`)

        for(let i in body){
            paramExists = false
            for(let g in user){
                if(i === g){
                    switch(i){
                        case("name"):
                            String.validate.notVoid(body[i])
                            break;

                        case("surname"):
                            String.validate.notVoid(body[i])
                            break;

                        case("email"):
                            String.validate.notVoid(body[i])
                            Email.validate(body[i])
                            break;
                    }
                    paramExists = true
                    user[i] = body[i]
                }
            }
            if(paramExists === false){
                throw new UnexistenceError(`${i} is not a parameter in user`)
            }
        }
        await user.save()

    })()
}