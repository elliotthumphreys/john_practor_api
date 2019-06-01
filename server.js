const mongoose = require('mongoose')
const config = require('./_config/config.json')
const app = require('./app.js')
const uri = process.env.MONGODB_URI || config.connectionString

const startServer = async () => {
    await mongoose.connect(uri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true
    });

    const { PORT = 3000 } = process.env
    
    app.listen(PORT, function () {
        console.log('Server listening on port ' + PORT)
    })
}

const exitHandler = () => {
    const previousReadyState = mongoose.connection.readyState
    mongoose.connection.close()
    console.info(`Closing mongodb connection, previous readyState: ${previousReadyState}, readyState: ${mongoose.connection.readyState}`) 
}

process.stdin.resume()

process.on('exit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('uncaughtException', exitHandler)

startServer()