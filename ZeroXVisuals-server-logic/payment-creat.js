/**
* Payement creat
*
* @param {string} userId 
* 
* @returns {undefined}
*
* @throws {UnexistenceError} if cart with id already exists
*/

require('zeroxvisuals-commons/polyfills/string')
const{ errors: { UnexistenceError, ValueError } } = require('zeroxvisuals-commons')
const { models: { Cart, User } } = require('zeroxvisuals-data')
const stripe = require('stripe')(process.env.key)
 
module.exports = (userId) => {
String.validate.notVoid(userId)

return (async () => {

    let items = []
    let productIds = {}
    let customer = undefined

    //TODO hacer algo con el session id (guardarlo como payments in process o algo en el usuario y depespues guardar toda la info del pago)

    const cart = await Cart.findOne({user: userId}).select('-__v').populate([{path: 'products', select: 'price image name'}, {path: 'user', select: 'name surname email stripeCustomer'}]).lean()

    if (!cart) throw new UnexistenceError(`cart with user id:${userId} dont exists`)
    if(cart.products.length === 0) throw new ValueError('cart is empty')

    //creat price_data for every product in cart

    for(var i in cart.products){
        items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: cart.products[i].name,
                    images: [cart.products[i].image]
                },
                unit_amount: (cart.products[i].price * 100)
            },
            quantity: 1,
        })
        productIds['product'+ i] = cart.products[i]._id.toString()
    }

    //retrieve customer if exists, if not creat new one

    if(cart.user.stripeCustomer){
        customer = await stripe.customers.retrieve(cart.user.stripeCustomer)
    }else{
        customer = await stripe.customers.create({
            name: cart.user.name + ' ' + cart.user.surname,
            email: cart.user.email,
            description: `user with mongoId: ${userId}`
        })
        //save customer.id in user database

        const user = await User.findById(userId)
        user.stripeCustomer = customer.id
        await user.save()

    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        customer: customer.id,
        client_reference_id: userId,
        metadata : productIds,
        success_url: 'http://localhost:3000',
        cancel_url: 'https://bing.com',
    })

    return session

})()
}