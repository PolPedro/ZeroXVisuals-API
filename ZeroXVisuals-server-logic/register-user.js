require('zeroxvisuals-commons/polyfills/string')
require('zeroxvisuals-commons/polyfills/json')
const{ utils: { Email, Password }, errors: { DuplicityError } } = require('zeroxvisuals-commons')
const { models: { User } } = require('zeroxvisuals-data')
const bcrypt = require('bcryptjs')
const creatCart = require('./cart-creat')

/**
 * Register User
 *
 * @param {string} name users name
 * @param {string} surname users surname 
 * @param {string} email users email
 * @param {string} password users password
 * 
 * @returns {undefined}
 *
 * @throws {DuplicityError} if user already exists
 */

module.exports = (name, surname, email, password, ip) => {
    String.validate.notVoid(name)
    String.validate.notVoid(surname)
    String.validate.notVoid(email)
    Email.validate(email)
    String.validate.notVoid(password)
    Password.validate(password)

    return (async () => {
        let userId 
        const user = await User.findOne({ email })

        if (user) throw new DuplicityError(`user with e-mail ${email} already exists`)

        const hash = await bcrypt.hash(password, 10)

        const newUser = await User.create({ name, surname, email, password: hash })

        //creat the cart and link the cart for the user
        try{

            newUser.cart = await creatCart(newUser._id)

        }catch(error){

            throw new DuplicityError(error.message)

        }

        //add user ip to ip list 

        newUser.ips.push(ip)

        //save newUser

        await newUser.save()

    })()
}