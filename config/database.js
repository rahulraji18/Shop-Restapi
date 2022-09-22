const mongoose = require('mongoose')

// Uncaught Exception 
process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`)
    console.log('Shutting Down The Server Due To Uncaught Exception')    
    process.exit(1)
})

mongoose.connect(process.env.MONGODB_URL)
.then((db) => {
    console.log(`Mongodb connected with server: ${db.connection.host}`)
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})

//Unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err.message}`)
    console.log('Shutting Down The Server Due To Unhandled Promise Rejection')

    mongoose.connection.close(() => {
        process.exit(1)
    })
})