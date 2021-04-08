const { handleError } = require('../../helpers')
const {productQuery} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    const { body: { words, filter} } = req

    try {
        productQuery(words, filter)
            .then((products) => res.send(products))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}