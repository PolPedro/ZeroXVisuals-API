const { handleError } = require('../../helpers')
const { awsCreatLink } = require('zeroxvisuals-server-logic')
const { utils: { jwtPromised } } = require('zeroxvisuals-commons')

module.exports = (req, res) => {
    const { body: { productId } } = req
    const { payload: { sub: userId } } = req
    
    try {
        awsCreatLink(userId, productId)
            .then((signedLink) => res.send(signedLink))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}  