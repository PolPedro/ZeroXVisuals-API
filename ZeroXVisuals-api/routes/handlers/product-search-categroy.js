const { handleError } = require('../../helpers')
const {productCategory} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    const { body: { category, filter} } = req

    try {
        productCategory(category, filter)
            .then((products) => res.send(products))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}