const ErrorHandler = require('../utils/ErrorHandling')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

 // Wrong Mongodb Id error(cast error)   
    if(err.name === 'CastError') {
        const message = `Resource Not Found. Invalid : ${err.path}`
        err = new ErrorHandler(message, 400)
    }

 // Mongoose Duplicate key error
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);

    } 
    
 // Wrong JWT Error
 if(err.code === 'JsonwebTokenError') {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message,400);
}     

 // JWT Expire Error
 if(err.code === 'TokenExpiredError') {
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message,400);
}     

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        status: err.statusCode,
        // error: err.stack
    })
}