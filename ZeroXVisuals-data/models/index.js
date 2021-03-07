const { model } = require('mongoose')
const { user } = require('./schemas')
const { product } = require('./schemas')
const {cart} = require('./schemas')

module.exports = {
    User: model('User', user),
    Cart: model('Cart', cart),
    Product: model('Product', product)
}
