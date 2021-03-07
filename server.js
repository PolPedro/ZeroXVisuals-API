const server = require('./zeroXVisuals-api/server')
const {env: { MONGODB_URL, PORT } } = process

console.debug('starting server')

try {
    console.debug('connecting to database')
    server(MONGODB_URL, PORT)

} catch (error) {
    throw new Error(error)
}