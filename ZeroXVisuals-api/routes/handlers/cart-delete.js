const { handleError } = require('../../helpers')
const {cartDelete} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    const { payload: { sub: userId } } = req

    try {
        cartDelete(userId)
            .then(() => res.send())
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}