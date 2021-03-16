const { handleError } = require('../../helpers')
const { updateUser } = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    const { body } = req
    const {payload: {sub: userId} } = req

    try {
        updateUser(userId, body)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}