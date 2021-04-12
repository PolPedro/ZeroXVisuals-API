const { handleError } = require('../../helpers')
const {paymentCreat} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    const { payload: { sub: userId } } = req

    try {
        paymentCreat(userId)
            .then((session) => res.send({ id: session.id }))
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}