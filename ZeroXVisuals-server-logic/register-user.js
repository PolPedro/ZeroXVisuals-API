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

module.exports = (name, surname, email, password) => {
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

        await User.create({ name, surname, email, password: hash }).then(function cart(params) {
            creatCart(params._id)
        })

    })()
}