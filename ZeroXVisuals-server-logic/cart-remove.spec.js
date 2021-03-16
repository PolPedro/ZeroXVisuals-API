require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { Product , Cart}, mongoose: {ObjectId} } = require('zeroXVisuals-data')
const removeCart = require('./cart-remove')

describe('logic - remove cart', () => {
    before(() => mongoose.connect(MONGODB_URL))

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    let userId
    let productId = []

    beforeEach(async () => {
        await Product.deleteMany()
        await Cart.deleteMany()

        userId = `60421acd5dc16d383c54414f`

        const newCart = await Cart.create({ user: ObjectId(userId) })

        for(var i = 0; i < 3; i++){
            const product = await Product.create({
                name: makeid(5),
                description: makeid(20),
                price: Math.floor(Math.random() * 100),
                image: "https://zeroxvisuals/images/" + makeid(7),
                link: "https://zeroxvisuals/products/" + makeid(7)
            })
            productId.unshift(product._id)
            newCart.products.unshift(product._id)
            newCart.quantity += 1
            await newCart.save()
        }
        
    })

    it('should succeed on reomving product form cart', async () => {

        let cart = await Cart.findOne({user: userId}).lean()

        //control that the cart has all the products

        expect(cart.quantity).to.equal(3)

        expect(cart.products.length).to.equal(3)

        expect(cart.products[0].toString()).to.equal(productId[0].toString())

        expect(cart.products[1].toString()).to.equal(productId[1].toString())

        expect(cart.products[2].toString()).to.equal(productId[2].toString())

        //call removeCart
        
        const remove = await removeCart(userId.toString(), productId[1].toString())
        
        expect(remove).to.be.undefined

        cart = await Cart.findOne({user: userId}).lean()

        expect(cart.quantity).to.equal(2)

        expect(cart.products.length).to.equal(2)

        expect(cart.products[0].toString()).to.equal(productId[0].toString())

        expect(cart.products[1].toString()).to.equal(productId[2].toString())

    })

    it('should fail on adding product to cart wrong userId', async () => {

        const fakeId = '60421acd5dc16d283c54414f'
        
        await removeCart(ObjectId(fakeId).toString(), productId.toString())
            .catch((error)=> {
                expect(error).to.exist
                expect(error.message).to.equal('cart with user id:60421acd5dc16d283c54414f dont exists')
            })
    })

    it('should fail on adding product to cart wrong ProductId', async () => {

        const fakeId = '60421acd5dc16d283c54414f'
        
        await removeCart(userId.toString(), ObjectId(fakeId).toString())
            .catch((error)=> {
                expect(error).to.exist
                expect(error.message).to.equal('product with id:60421acd5dc16d283c54414f dont exists')
            })
    })

    it('should fail on adding product to cart wrong userId not a string', async () => {

        try{
            removeCart(1,productId[1].toString())
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal(`1 is not a string`)
        }
    })

    it('should fail on adding product to cart wrong ProductId not a string', async () => {

        try{
            removeCart(userId.toString(),1)
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal(`1 is not a string`)
        }
    })
    
    afterEach(() => Cart.deleteMany(), Product.deleteMany())

    after(mongoose.disconnect)
})