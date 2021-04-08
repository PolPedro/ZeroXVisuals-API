const { handleError } = require('../../helpers')
const { registerUser, creatCart } = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    const { body: { name, surname, email, password }, ip} = req

    try {
        registerUser(name, surname, email, password, ip)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}