const authenticateUser = require('zeroxvisuals-server-logic/authenticate-user');

module.exports = {
    registerUser : require('./register-user'),
    retrieveUser: require('./retrieve-user'),
    authenticateUser: require('./authenticate-user'),
    addCart: require('./cart-add'),
    removeCart: require('./cart-remove'),
    deleteCart: require('./cart-delete'),
    cartRetrieve: require('./cart-retrieve'),
    productRetrieve: require('./product-retrieve'),
    updateUser: require('./update-user'),
    addRating: require('./rating-add'),
    productQuery: require('./product-search-query'),
    productCategroy: require('./product-search-categroy'),
    paymentRecieved: require('./payment-receive'),
    paymentCreat: require('./payment-creat'),
    awsCreatLink: require('./aws-creat-link')
}