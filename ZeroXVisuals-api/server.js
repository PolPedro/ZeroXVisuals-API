require('dotenv').config()

const express = require('express')
const fs = require('fs')
var http = require('http')
var https = require('https')
const { name, version } = require('./package.json')
const {cors} = require('./middlewares')
const path = require('path')
const { mongoose } = require('zeroxvisuals-data')
const { api } = require('./routes')

const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}

console.debug('starting server')

module.exports = (MONGODB_URL, PORT) => {

    mongoose.connect(MONGODB_URL)
    .then(() => {
        console.info(`connected to database ${MONGODB_URL}`)
        
        const app = express()

        
        app.use(cors)
        
        app.use('/api', api)
        
        app.get('*', (req, res) => {
            res.status(404).send('Not Found :(')
        })
        
        const httpsServer = https.createServer(options, app)

        //app.listen(PORT, () => console.info(`server ${name} ${version} running on port ${PORT}`))
        
        httpsServer.listen(PORT, () => console.info(`server https${name} ${version} running on port ${PORT}`))
        
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