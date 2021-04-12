// require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const chalk = require('chalk')
const dateFormat = require('dateformat')
const { api } = require('./routes')
const { mongoose } = require('zeroxvisuals-data')
const { name, version } = require('./package.json')
const {config: {winston}} = require('zeroxvisuals-commons')

//TODO allow origins cors setup

var allowedOrigins = ['http://localhost:8080'];

//TODO log function for cleaner code

module.exports = (MONGODB_URL, PORT) => {

    mongoose.connect(MONGODB_URL)
    .then(() => {
        console.info(chalk.greenBright(`connected to database ${MONGODB_URL} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`))
        winston.info(`connected to database ${MONGODB_URL} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`)
        
        const app = express()

        // ||security||

        app.use(helmet())
        app.disable('x-powered-by')
        app.set('trust proxy', true)

        // ||cors policy with cors middleware|| // TODO configurate cors to only let specific routes enter the appi
        
        app.use(cors())

        // ||logger with morgan and winston||

        app.use(morgan('combined')) //:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
        app.use(morgan('combined', {stream: winston.stream})) 

        // ||express server||
        
        app.use('/api', api)
        app.get('*', (req, res) => {
            res.status(404).send('Not Found :(')
        })
        app.listen(PORT, () => {
            console.info(chalk.greenBright(`server ${name} ${version} running on port ${PORT} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`))
            winston.info(`server ${name} ${version} running on port ${PORT} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`)
        })
        
        let interrupted = false

        // ||close server||
        
        process.on('SIGINT', () => {
            if (!interrupted) {

                interrupted = true

                console.debug(chalk.blue('stopping server'))
                console.debug(chalk.blue('disconnecting database'))
                
                mongoose.disconnect()
                    .then(() => {
                        console.info(chalk.greenBright(`disconnected database - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`))
                        winston.info(`disconnected database - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`)
                    })
                    .catch(error => {throw new Error('could not disconnect from mongo', error)})
                    .finally(() => {
                        console.info(chalk.greenBright(`server ${name} ${version} stopped - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`))
                        winston.info(`server ${name} ${version} stopped - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`) 
                        setTimeout(()=>{
                            process.exit() 
                        },500)
                    })
            }
        })
    })
    .catch(error => {
        throw new Error(error)
    })
}