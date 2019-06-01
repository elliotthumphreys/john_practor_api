const awsServerlessExpress = require('aws-serverless-express')
const mongoose = require('mongoose')
const app = require('./app.js')
const uri = process.env.MONGODB_URI
const server = awsServerlessExpress.createServer(app)

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

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await mongoose.connect(uri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true
    });

    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
}