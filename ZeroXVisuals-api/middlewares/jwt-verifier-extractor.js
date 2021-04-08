const{ errors: { VoidError } } = require('zeroxvisuals-commons')
const { utils: { jwtPromised } } = require('zeroxvisuals-commons')

module.exports = (secret, errorHandler) =>
    (req, res, next) => {
        try {
            if (!req.headers.authorization) throw new VoidError('token not provided')
            const [, token] = req.headers.authorization.split(' ')

            jwtPromised.verify(token, secret)
                .then(payload => {
                    req.payload = payload

                    next()
                })
                .catch(error => errorHandler(error, res))
        } catch (error) {
            errorHandler(error, res)
        }
    }