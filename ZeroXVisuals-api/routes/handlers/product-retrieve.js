const { handleError } = require('../../helpers')
const {productRetrieve} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    const { body: { productId } } = req

    try {
        productRetrieve(productId)
            .then((product) => res.send(product))
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}