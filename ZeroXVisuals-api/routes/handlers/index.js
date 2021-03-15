const authenticateUser = require('zeroxvisuals-server-logic/authenticate-user');

module.exports = {
    registerUser : require('./register-user'),
    retrieveUser: require('./retrieve-user'),
    authenticateUser: require('./authenticate-user'),
    addCart: require('./cart-add'),
    removeCart: require('./cart-remove'),
    deleteCart: require('./cart-delete'),
    cartRetrieve: require('./cart-retrieve')
}