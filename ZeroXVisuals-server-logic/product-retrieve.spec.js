require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retrieveProduct = require('./product-retrieve')
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { Product, Rate }, mongoose: {ObjectId}} = require('zeroXVisuals-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve product', () => {
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

    let productId = []

    beforeEach(async () => {
        await Product.deleteMany()

        for(var i = 0; i < 3; i++){
            const product = await Product.create({
                name: makeid(5),
                description: makeid(20),
                price: Math.floor(Math.random() * 100),
                image: "https://zeroxvisuals/images/" + makeid(7),
                link: "https://zeroxvisuals/products/" + makeid(7)
            })
            product.rates.unshift(
                new Rate ({
                    productId: ObjectId("6043f6db122f522aa48a2e8e"),
                    stars:  Math.floor(Math.random() * 5),
                    date: new Date,
                    message: makeid(15)
                })
            )
            await product.save()

            productId.unshift(product._id.toString())

        }
        
    })

    it('should succeed on retrieving product', () => {
        retrieveProduct(productId[1])
            .then((result) => {
                expect(result).to.exist
            })
        
    })

    it('should fail on adding product to cart wrong productId', () => {

        const fakeId = '60421acd5dc16d283c54414f'
        
        retrieveProduct(ObjectId(fakeId).toString())
            .catch((error)=> {
                expect(error).to.exist
                expect(error.message).to.equal('product with id:60421acd5dc16d283c54414f dont exists')
            })
    })

    it('should fail on deleting product to cart wrong productId not a string', async () => {

        try{
            retrieveProduct(1)
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal(`1 is not a string`)
        }
    })
    
    afterEach(() => Product.deleteMany())

    after(mongoose.disconnect)
})