const { handleError } = require('../../helpers')
const { retrievePacks } = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {

    try {
        retrievePacks()
            .then((products) => res.send(products))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}