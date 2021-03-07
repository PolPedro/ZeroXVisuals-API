require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const retriveUser = require('./retrieve-user')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User } } = require('zeroXVisuals-data')
const bcrypt = require('bcryptjs')

describe('logic - register user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    const fakeId = '5ee0ed9a603a0a4f3c650fe1'
    let name, surname, email, password, user

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = password = `123password${Math.floor(Math.random() * 11)}`

        const hash = await bcrypt.hash(password, 10)

        user = await User.create({name, surname, email, password: hash})

        userId = user.id
    })

    it('should succeed on retriving user', async () => {
        const result = await retriveUser(userId)

        expect(result).to.exist
        expect(result.name).to.be.equal(user.name)
        expect(result.surname).to.be.equal(user.surname)
        expect(result.email).to.be.equal(user.email)
    })

    it('should fail on retriving user', async () => {
        result = await retriveUser(fakeId)
            // .then(() => {throw new Erro ('shoud not reach this point')})
            .catch( error => {
                expect(error).to.exist

                
                expect(error.message).to.be.equal(`user with id: ${fakeId} dont exists`)
            })
        

    
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})