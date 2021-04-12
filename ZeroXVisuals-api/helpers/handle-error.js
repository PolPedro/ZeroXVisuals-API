const { errors: { DuplicityError, VoidError, UnexistenceError, CredentialsError, ParametersError } } = require('zeroxvisuals-commons')
const { JsonWebTokenError } = require('jsonwebtoken') 
const chalk = require('chalk')
const {config: {winston}} = require('zeroxvisuals-commons')
const dateFormat = require('dateformat')

module.exports = function (error, res, req) {
    let status = 500

    // ||Error handel status||

    switch (true) {
        case error instanceof TypeError || error instanceof VoidError || error instanceof ParametersError:
            status = 406
            break
        case error instanceof DuplicityError || error instanceof UnexistenceError:
            status = 409
            break
        case error instanceof CredentialsError || error instanceof JsonWebTokenError:
            status = 401
            break
    }

    // ||logger||
    
    res.status(status).json({ error: error.message })
    if (status < 500){
        winston.warn(`Error handle - ${status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`)
        console.warn(chalk.yellow(`Error handle - ${status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`))
    }else{
        winston.error(`Error handle - ${status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`)
        console.error(chalk.red(`Error handle - ${status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - [${dateFormat(new Date(), "UTC:dd/mmm/yyyy:HH:MM:ss")}]`))
    }
}