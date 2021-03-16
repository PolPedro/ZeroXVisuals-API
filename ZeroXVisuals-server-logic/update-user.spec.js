require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, TEST_SECRET: SECRET, TEST_API_URL: API_URL  } } = process

const updateUser = require('./update-user')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User }, mongoose: {ObjectId} } = require('zeroXVisuals-data')

describe('logic - update user', () => {
    before(() => mongoose.connect(MONGODB_URL))
    
    let name, surname, email, password, body, changedName, changedSurname, userId

    beforeEach(async () => {
        await User.deleteMany()

        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`

        changedName = `changedname-${random()}`
        changedSurname = `changedstreet-${random()}`

        body = {
            name: changedName,
            surname: changedSurname 
        }

    })
    
    describe('user exists', () => {
        beforeEach(async () => {
            const user = await User.create({name, surname, email, password})
            userId = user.id
        })

        it('should succeed on updating user', async () => {

            //check before updating user

            let results = await User.findById(userId)
            expect(results).to.exist
            expect(results.name).to.be.equal(name)
            expect(results.surname).to.be.equal(surname)
            expect(results.email).to.be.equal(email)

            await updateUser(userId, body)

            //check after updating user

            results = await User.findById(userId)
            expect(results).to.exist
            expect(results.name).to.be.equal(changedName)
            expect(results.surname).to.be.equal(changedSurname)
            expect(results.email).to.be.equal(email)
        })

        it('should fail on updating user unvalid param', async() => {

            const fakebody = {
                hello: "bananas",
                surname: "astralopitukukx"
            }

            //check before updating user

            let results = await User.findById(userId)
            expect(results).to.exist
            expect(results.name).to.be.equal(name)
            expect(results.surname).to.be.equal(surname)
            expect(results.email).to.be.equal(email)

            await updateUser(userId, fakebody)
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.be.equal("hello is not a parameter in user")
                })

        })
        it('should fail on updating user invalid name', async() => {

            const fakebody = {
                name: ""
            }

            //check before updating user

            let results = await User.findById(userId)
            expect(results).to.exist
            expect(results.name).to.be.equal(name)
            expect(results.surname).to.be.equal(surname)
            expect(results.email).to.be.equal(email)

            await updateUser(userId, fakebody)
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.be.equal("string is empty or blank")
                })

        })
        it('should fail on updating user invalid email', async() => {

            const fakebody = {
                email: "bananas"
            }

            //check before updating user

            let results = await User.findById(userId)
            expect(results).to.exist
            expect(results.name).to.be.equal(name)
            expect(results.surname).to.be.equal(surname)
            expect(results.email).to.be.equal(email)

            await updateUser(userId, fakebody)
                .catch(error => {
                    expect(error).to.exist
                    expect(error.message).to.be.equal("bananas is not an e-mail")
                })

        })
    })
      
    describe('user dont exist', () => {
        let fakeId
        beforeEach(async() => {
            fakeId = '5ee0ed9a603a0a4f3c650fe1'
        })
        it('should fail on retriving user', async () => {
            result = await updateUser(fakeId, body)
                .catch( error => {
                    expect(error).to.exist
                    expect(error.message).to.be.equal(`user with id ${fakeId} dont exists`)
                })
        })
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})