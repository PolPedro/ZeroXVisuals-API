const server = require('zeroxvisuals-api')
//const {env: { MONGODB_URL, PORT } } = process
const { env: { MONGODB_URL } } = process
// const PORT = PORT_CLI || PORT_ENV || 8081
const PORT = process.env.PORT || 8080

console.debug('starting server')

try {
    console.debug('connecting to database')
    server(MONGODB_URL, PORT)

} catch (error) {
    throw new Error(error)
}