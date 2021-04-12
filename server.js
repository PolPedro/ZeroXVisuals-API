// const PORT = PORT_CLI || PORT_ENV || 8081
//const {env: { MONGODB_URL, PORT } } = process

const server = require('zeroxvisuals-api')
const chalk = require('chalk')
const { env: { MONGODB_URL } } = process
const PORT = process.env.PORT || 8080

// ||start server||

try {
    console.debug(chalk.blue('starting server'))
    console.debug(chalk.blue('connecting to database')) 

    server(MONGODB_URL, PORT)

} catch (error) {
    throw new Error(error)
}