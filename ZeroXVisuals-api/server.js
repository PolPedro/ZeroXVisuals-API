require('dotenv').config()

const express = require('express')
const { name, version } = require('./package.json')
// const {cors} = require('./middlewares')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { mongoose } = require('zeroxvisuals-data')
const { api } = require('./routes')

var allowedOrigins = ['http://localhost:8080'];

console.debug('starting server')

module.exports = (MONGODB_URL, PORT) => {

    mongoose.connect(MONGODB_URL)
    .then(() => {
        console.info(`connected to database ${MONGODB_URL}`)
        
        const app = express()

        // ||security||

        app.use(helmet())
        app.disable('x-powered-by')
        app.set('trust proxy', true)

        // ||cors policy with cors middleware|| // TODO configurate cors to only let specific routes enter the appi
        
        app.use(cors())

        // ||logger with morgan||

        app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'))

        // ||api directions||
        
        app.use('/api', api)
        
        app.get('*', (req, res) => {
            res.status(404).send('Not Found :(')
        })

        app.listen(PORT, () => console.info(`server ${name} ${version} running on port ${PORT}`))
        
        let interrupted = false
        
        process.on('SIGINT', () => {
            if (!interrupted) {
                interrupted = true
                
                console.debug('stopping server')
                
                console.debug('disconnecting database')
                
                mongoose.disconnect()
                .then(() => console.info('disconnected database'))
                .catch(error => file.error('could not disconnect from mongo', error))
                .finally(() => {
                    console.info(`server ${name} ${version} stopped`)
                    
                    setTimeout(() => {
                        file.close()
                        
                        setTimeout(() => {
                            process.exit()
                        }, 500)
                    }, 500)
                })
            }
        })
    })
    .catch(error => {
        throw new Error(error)
    })
}