const awsServerlessExpress = require('aws-serverless-express')
const mongoose = require('mongoose')
const app = require('./app.js')
const uri = process.env.MONGODB_URI
const server = awsServerlessExpress.createServer(app)

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await mongoose.connect(uri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true
    });

    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
}