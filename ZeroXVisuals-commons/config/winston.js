const winston = require('winston')
const appRoot = require('app-root-path')

const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/ZeroXVisuals-logs/app.log`,
        handleExceptions: true, 
        json: true,
        maxsize: 5242880, // 5mb
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
}

const logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})

logger.stream = {
    write: function(message, encoding) {
        logger.info(message)
    }
}

module.exports = logger