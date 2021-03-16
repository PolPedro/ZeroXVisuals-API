require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const creatCart = require('./cart-creat')
const { random } = Math
const { expect } = require('chai')
require('zeroXVisuals-commons/polyfills/json')
const { mongoose, models: { User , Cart}, mongoose: {ObjectId} } = require('zeroXVisuals-data')
const bcrypt = require('bcryptjs')
const creatproducts = require('./creat-random-products')

describe('logic - creat cart', () => {
    before(() => mongoose.connect(MONGODB_URL))

    it('creat products', async () => {
        
        const result = await creatproducts()
        expect(result).to.be.undefined
    })

    after(mongoose.disconnect)
})
