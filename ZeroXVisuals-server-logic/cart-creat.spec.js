require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const creatCart = require('./cart-creat')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User , Cart}, mongoose: {ObjectId} } = require('zeroXVisuals-data')
const bcrypt = require('bcryptjs')
const cartCreat = require('./cart-creat')

describe('logic - creat cart', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, email, password, id

    beforeEach(async () => {
        await User.deleteMany()
        await Cart.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `123password${Math.floor(Math.random() * 11)}` // cant use a float number on the password

        await User.create({ name, surname, email, password}).then(function (params) {
            id = params._id
        })
    })

    it('should succeed on creating cart', async () => {
        
        const result = await cartCreat(id)

        expect(result).to.be.undefined

        const carts = await Cart.find()

        expect(carts.length).to.equal(1)

        const [cart] = carts

        expect(cart.user.toString()).to.equal(id.toString())
        expect(cart.quantity).to.equal(0)
        expect(cart.products.length).to.equal(0)
    })

    describe('when cart with user id already exists', () => {
        beforeEach(() => Cart.create({user: ObjectId (id)}))
        it('shoud fail on creating cart', async () => {
            const result = await cartCreat(id)
                .catch((error) => {
                    expect(error).to.exist
                    expect(error.message).to.equal('the cart for this user already exists')
                })

            expect(result).to.be.undefined

            const carts = await Cart.find()
    
            expect(carts.length).to.equal(1)
        })
    })

    afterEach(() => User.deleteMany(), Cart.deleteMany())

    after(mongoose.disconnect)
})
