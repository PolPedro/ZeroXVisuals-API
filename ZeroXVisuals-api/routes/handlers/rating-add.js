const { handleError } = require('../../helpers')
const {addRating} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    
    const { payload: { sub: userId } } = req
    const { body: { productId, stars, message } } = req

    try {
        addRating(productId, userId, stars, message)
            .then(() => res.status(201).send())
            .catch(error => handleError(error, res, req))
    } catch (error) {
        handleError(error, res)
    }
}