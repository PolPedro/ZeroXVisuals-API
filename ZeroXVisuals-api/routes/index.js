const { env: { SECRET } } = process

const { Router } = require('express')
const { registerUser, retrieveUser, authenticateUser, addCart, removeCart, deleteCart, cartRetrieve } = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

api.post('/user', parseBody, registerUser)

api.post('/user/auth', parseBody, authenticateUser)

api.get('/user', verifyExtractJwt, retrieveUser)

api.post('/cart/add',verifyExtractJwt,parseBody,addCart)

api.post('/cart/remove',verifyExtractJwt,parseBody,removeCart)

api.get('/cart/delete',verifyExtractJwt,deleteCart)

api.get('/cart/retrieve',verifyExtractJwt,cartRetrieve)

module.exports = {
    api
}