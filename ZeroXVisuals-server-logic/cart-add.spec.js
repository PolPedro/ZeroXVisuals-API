require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { Product , Cart}, mongoose: {ObjectId} } = require('zeroXVisuals-data')
const cartAdd = require('./cart-add')

describe('logic - add cart', () => {
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

    let userId, productId

    beforeEach(async () => {
        await Product.deleteMany()
        await Cart.deleteMany()

        userId = `60421acd5dc16d383c54414f`

        const newCart = await Cart.create({ user: ObjectId(userId) })

        const product = await Product.create({
            name: makeid(5),
            description: makeid(20),
            price: Math.floor(Math.random() * 100),
            image: "https://zeroxvisuals/images/" + makeid(7),
            link: "https://zeroxvisuals/products/" + makeid(7)
        })

        productId = product._id
    })

    it('should succeed on adding product to cart', async () => {
        
        const add = await cartAdd(userId.toString(), productId.toString())

        expect(add).to.be.undefined

        const cart = await Cart.findOne({user: userId}).lean()

        expect(cart.quantity).to.equal(1)

        expect(cart.products.length).to.equal(1)

       expect(cart.products[0].toString()).to.equal(productId.toString())
    })

    it('should fail on adding product to cart wrong userId', async () => {

        const fakeId = '60421acd5dc16d283c54414f'
        
        await cartAdd(ObjectId(fakeId).toString(), productId.toString())
            .catch((error)=> {
                expect(error).to.exist
                expect(error.message).to.equal('cart with user id:60421acd5dc16d283c54414f dont exists')
            })
    })

    it('should fail on adding product to cart wrong ProductId', async () => {

        const fakeId = '60421acd5dc16d283c54414f'
        
        await cartAdd(userId.toString(), ObjectId(fakeId).toString())
            .catch((error)=> {
                expect(error).to.exist
                expect(error.message).to.equal('product with id:60421acd5dc16d283c54414f dont exists')
            })
    })

    it('should fail on adding product to cart wrong userId not a string', async () => {

        try{
            cartAdd(1,productId.toString())
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal(`1 is not a string`)
        }
    })

    it('should fail on adding product to cart wrong ProductId not a string', async () => {

        try{
            cartAdd(userId.toString(),1)
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal(`1 is not a string`)
        }
    })
    
    afterEach(() => Cart.deleteMany(), Product.deleteMany())

    after(mongoose.disconnect)
})