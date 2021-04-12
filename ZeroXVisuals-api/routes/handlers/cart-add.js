const { handleError } = require('../../helpers')
const {addCart} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    
    const { payload: { sub: userId } } = req
    const { body: { productId } } = req

    try {
        addCart(userId, productId)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}