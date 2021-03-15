const { handleError } = require('../../helpers')
const {cartRemove} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    
    const { payload: { sub: userId } } = req
    const { body: { productId } } = req

    try {
        cartRemove(userId, productId)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}