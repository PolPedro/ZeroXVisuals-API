const server = require('zeroxvisuals-api')
//const {env: { MONGODB_URL, PORT } } = process
const { argv: [, , PORT_CLI], env: { PORT: PORT_ENV, SECRET, MONGODB_URL } } = process
const PORT = PORT_CLI || PORT_ENV || 8081

console.debug('starting server')

try {
    console.debug('connecting to database')
    server(MONGODB_URL, PORT)

} catch (error) {
    throw new Error(error)
}