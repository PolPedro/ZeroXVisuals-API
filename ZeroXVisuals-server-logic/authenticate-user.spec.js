require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const authenticate = require('./authenticate-user')
const { random } = Math
const { expect } = require('chai')
require('ZeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User } } = require('ZeroXVisuals-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let name, surname, email, password

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `123password${Math.floor(Math.random() * 11)}`

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({name, surname, email, password: hash})

        userId = user.id
    })

    it('should succeed on correct credentials for user', async () => {
        await authenticate(email, password)
            .then((_userId) => {
                expect(_userId).to.exist
                expect(_userId).to.equal(userId)
            })
    })

    it('should fail on wrong password', async () => {
        await authenticate(email, 'password')
            .catch((error) => {
                expect(error).to.exist
                expect(error.message).to.equal(`Wrong email or password`)
            })
    })

    it('should fail on wrong email', async () => {
        await authenticate('email@email.com', password)
            .catch((error) => {
                expect(error).to.exist
                expect(error.message).to.equal(`Wrong email or password`)
            })
     })

    it('should fail on invalid email', async () => {
       try {    
           await authenticate('email', password)
       } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal(`email is not an e-mail`)
       } 
    })

    

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})