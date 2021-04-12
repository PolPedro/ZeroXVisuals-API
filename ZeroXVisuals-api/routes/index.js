const { env: { SECRET } } = process

const { Router } = require('express')
const { registerUser, retrieveUser, authenticateUser, addCart, removeCart, deleteCart, cartRetrieve, productRetrieve, updateUser, addRating, productQuery, productCategroy, paymentRecieved, paymentCreat, awsCreatLink } = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

// ||Routes||

api.post('/user', parseBody, registerUser)

api.post('/user/auth', parseBody, authenticateUser)

api.get('/user', verifyExtractJwt, retrieveUser)

api.post('/user/update',verifyExtractJwt,parseBody,updateUser)

api.post('/cart/add',verifyExtractJwt,parseBody,addCart)

api.post('/cart/remove',verifyExtractJwt,parseBody,removeCart)

api.get('/cart/retrieve',verifyExtractJwt,cartRetrieve)

api.delete('/cart/delete',verifyExtractJwt,deleteCart)

api.post('/product/retrieve',parseBody,productRetrieve)

api.post('/product/rating',verifyExtractJwt,parseBody,addRating)

api.post('/product/search/query',parseBody,productQuery)

api.post('/product/search/category',parseBody,productCategroy)

// ||Stripe Routes||

api.get('/payment',verifyExtractJwt,paymentCreat)

api.post('/webhook', bodyParser.raw({type: 'application/json'}),paymentRecieved) //webhook sended from stripe api

// ||AWS Routes||

api.post('/product/download',verifyExtractJwt,parseBody,awsCreatLink)

module.exports = {
    api
}