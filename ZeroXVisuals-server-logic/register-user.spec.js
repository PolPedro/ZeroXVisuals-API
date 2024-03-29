require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const registerUser = require('./register-user')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User, Cart } } = require('zeroXVisuals-data')
const bcrypt = require('bcryptjs')

describe('logic - register user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, email, password

    beforeEach(async () => {
        await User.deleteMany()
        await Cart.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `123password${Math.floor(Math.random() * 11)}` // cant use a float number on the password
    })

    it('should succeed on valid data', async () => {
        const result = await registerUser(name, surname, email, password)

        expect(result).to.be.undefined

        const users = await User.find()

        expect(users.length).to.equal(1)

        const [user] = users

        expect(user.name).to.equal(name)
        expect(user.surname).to.equal(surname)
        expect(user.email).to.equal(email)
        expect(user.cart).to.exist

        const match = await bcrypt.compare(password, user.password)

        expect(match).to.be.true

        const cart = Cart.findById(user.cart)

        expect(cart).to.exist
    })

    it('should fail on invalid argument', async () => {
        try{

            const result = await registerUser(undefined, surname, email, password)
            // expect(result).to.exist shoud not reach this point
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal('undefined is not a string')
        }
    })
    it('should fail on invalid password', async () => {
        try{

            const result = await registerUser(name, surname, email, '1a4')
            // expect(result).to.exist shoud not reach this point
        }catch(error){
            expect(error).to.exist
            expect(error.message).to.equal('password not valid')
        }
    })



    describe('when user already exists', () => {
        beforeEach(() => User.create({ name, surname, email, password }))

        it('should fail on trying to register an existing user', async () => {
            try {
                await registerUser(name, surname, email, password)
                // throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist

                expect(error).to.be.an.instanceof(Error)
                expect(error.message).to.equal(`user with e-mail ${email} already exists`)
            }
        })
    })

    afterEach(() =>{ User.deleteMany(), Cart.deleteMany()})

    after(mongoose.disconnect)
})