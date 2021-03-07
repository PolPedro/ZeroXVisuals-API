require('dotenv').config()

const { env: { SECRET } } = process

const { handleError } = require('../../helpers')
const { authenticateUser } = require('zeroxvisuals-server-logic')
const { utils: { jwtPromised } } = require('zeroxvisuals-commons')

module.exports = (req, res) => {
    const { body: { email, password } } = req
    
    try {
        authenticateUser(email, password)
            .then((userId) => jwtPromised.sign({ sub: userId }, SECRET, { expiresIn: '1d' }))
            .then((token) => res.send({token}))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}  