const { handleError } = require('../../helpers')
const {cartRetrieve} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    const { payload: { sub: userId } } = req

    try {
        cartRetrieve(userId)
            .then((cart) => res.send(cart))
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}