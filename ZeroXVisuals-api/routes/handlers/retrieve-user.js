const { handleError } = require('../../helpers')
const { retrieveUser } = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    
    const { payload: { sub: userId } } = req

    try {
        retrieveUser(userId)
            .then((user) => res.send(user))
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}