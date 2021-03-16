require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_SECRET: SECRET, TEST_API_URL: API_URL  } } = process

const addRating = require('./rating-add')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User, Product }, mongoose: {ObjectId} } = require('zeroXVisuals-data')

describe('logic - update user', () => {
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
    
    let name, surname, email, password, stars, message, userId, nameProd, descriptionProd, priceProd, imageProd, linkProd, productId

    beforeEach(async () => {
        await User.deleteMany()
        await Product.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `123password${Math.floor(Math.random() * 11)}`

        stars = Math.floor(Math.random() * 6)
        message = makeid(20)

        nameProd= makeid(5),
        descriptionProd= makeid(20),
        priceProd= Math.floor(Math.random() * 100),
        imageProd= "https://zeroxvisuals/images/" + makeid(7),
        linkProd= "https://zeroxvisuals/products/" + makeid(7)
        


    })
    
    describe('Product exists', () => {
        beforeEach(async () => {
            const user = await User.create({name, surname, email, password})
            const product = await Product.create({name: nameProd, description: descriptionProd, price: priceProd, image: imageProd, link: linkProd})
            userId = user.id.toString()
            productId = product.id.toString()
        })

        it('should succeed on adding rate first time', async () => {

            //check before adding rate

            let results = await Product.findById(productId)
            expect(results).to.exist
            expect(results.name).to.be.equal(nameProd)
            expect(results.rates.length).to.equal(0)

            await addRating(productId, userId, stars, message)

            //check after adding rate

            results = await Product.findById(productId)
            expect(results).to.exist
            expect(results.name).to.be.equal(nameProd)
            expect(results.rates.length).to.equal(1)
            expect(results.rates[0].userId.toString()).to.be.equal(userId)
            expect(results.rates[0].stars).to.be.equal(stars)
            expect(results.rates[0].message).to.be.equal(message)
        })

        it('should succeed on updating existing rate', async () => {

            //creat rate for user

            await addRating(productId, userId, stars, message)

            //check before adding rate

            let results = await Product.findById(productId)
            expect(results).to.exist
            expect(results.name).to.be.equal(nameProd)
            expect(results.rates.length).to.equal(1)
            expect(results.rates[0].userId.toString()).to.be.equal(userId)
            expect(results.rates[0].stars).to.be.equal(stars)
            expect(results.rates[0].message).to.be.equal(message)

            await addRating(productId, userId, (stars + 1 ), 'new message')

            //check after updating rate

            results = await Product.findById(productId)
            expect(results).to.exist
            expect(results.name).to.be.equal(nameProd)
            expect(results.rates.length).to.equal(1)
            expect(results.rates[0].userId.toString()).to.be.equal(userId)
            expect(results.rates[0].stars).to.be.equal((stars + 1 ))
            expect(results.rates[0].message).to.be.equal('new message')
        })

        it('should fail on adding rate invalid message', async () => {

            //check before adding rate

            let results = await Product.findById(productId)
            expect(results).to.exist
            expect(results.name).to.be.equal(nameProd)
            expect(results.rates.length).to.equal(0)

            try{
                await addRating(productId, userId, stars, 1)
            }catch(error){
                expect(error).to.exist
                expect(error.message).to.be.equal('1 is not a string')
            }
                
        })

        it('should fail on adding rate invalid stars', async () => {

            //check before adding rate

            let results = await Product.findById(productId)
            expect(results).to.exist
            expect(results.name).to.be.equal(nameProd)
            expect(results.rates.length).to.equal(0)

            try{
                await addRating(productId, userId, 'stars', message)
            }catch(error){
                expect(error).to.exist
                expect(error.message).to.be.equal('stars is not a number')
            }
        })

        
    })
      
    describe('product dont exist', () => {
        let fakeId
        beforeEach(async() => {
            fakeId = '5ee0ed9a603a0a4f3c650fe1'
        })
        it('should fail on retriving user', async () => {
            result = await addRating(fakeId, userId, stars, message)
                .catch( error => {
                    expect(error).to.exist
                    expect(error.message).to.be.equal(`product with id ${fakeId} dont exists`)
                })
        })
    })

    afterEach(() => User.deleteMany(), Product.deleteMany())

    after(mongoose.disconnect)
})