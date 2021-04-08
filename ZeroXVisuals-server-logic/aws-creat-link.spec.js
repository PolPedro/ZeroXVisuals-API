require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const creatLink = require('./aws-creat-link')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User, Product} } = require('zeroXVisuals-data')
const bcrypt = require('bcryptjs')
const products = require('zeroxvisuals-data/models/schemas/products')

describe('logic - creat link user', () => {
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

    let name, surname, email, password, userId, productId

    beforeEach(async () => {
        await User.deleteMany()
        await Product.deleteMany()

        
        const product = await Product.create({
            name: 'test-pack',
            description: makeid(20),
            category: 'packs',
            price: Math.floor(Math.random() * 100),
            image: "https://zeroxvisuals/images/" + makeid(7),
            link: "https://zeroxvisuals/products/" + makeid(7)
        })
        
        productId = product._id.toString()
        
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `123password${Math.floor(Math.random() * 11)}` // cant use a float number on the password
        productsbuy = [productId]

        const user = await User.create({name, surname, email, password, productsbuy})
        userId = user.id.toString()
    })

    it('should succeed on valid data', async () => {
        const link = await creatLink(userId, productId)

        expect(link).to.exist
    })

    it('should fail on invalid argument', async () => {
        try{

            const link = await creatLink(productId)
            // expect(result).to.exist shoud not reach this point
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal('undefined is not a string')
        }
    })

    it('should fail on invalid userid', async () => {
        const fakeId = '60421acd5dc16d283c54414f'
        
        await creatLink(fakeId, productId)
            .catch(error => {
                expect(error).to.exist
                expect(error.message).to.be.equal(`user with id: ${fakeId} dont exists`)
            })
        
    })

    it('should fail on invalid productId', async () => {
        const fakeId = '60421acd5dc16d283c54414f'
        await creatLink(userId, fakeId)
            .catch(error => {
                expect(error).to.exist
                expect(error.message).to.be.equal(`product with productId: ${fakeId}, has not been buyed by this user`)
            })
    })

    afterEach(() =>{ User.deleteMany(), Product.deleteMany()})

    after(mongoose.disconnect)
})