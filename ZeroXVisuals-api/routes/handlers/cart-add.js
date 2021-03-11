const { handleError } = require('../../helpers')
const {addCart} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    
    const { body: { cartId, productId } } = req

    try {
        addCart(cartId, productId)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}