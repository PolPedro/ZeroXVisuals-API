
/**
 * autenticate users or workers credentials
 *
 * @param {string} email users email
 * @param {string} password user password 
 * 
 * @returns {undefined}
 *
 * @throws {CredentialsError} if server throws error
 */

require('zeroxvisuals-commons/polyfills/string')
require('zeroxvisuals-commons/polyfills/json')
const { utils: { Email }, errors: { CredentialsError } } = require('zeroxvisuals-commons')
const { models: { User } } = require('zeroxvisuals-data')
const bcrypt = require('bcryptjs')


module.exports = (email, password) => {
    String.validate.notVoid(email)
    Email.validate(email)
    String.validate.notVoid(password)
    let user = null

    return (async () => {
        user = await User.findOne({ email })
 
        if (!user) throw new CredentialsError(`Wrong email or password`)

        const hash = await bcrypt.compare(password, user.password)

        if (!hash) throw new CredentialsError(`Wrong email or password`)

        return user.id
    })()
}