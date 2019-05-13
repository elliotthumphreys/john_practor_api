const awsServerlessExpress = require('aws-serverless-express')
const mongoose = require('mongoose')
const config = require('./_config/config.json')
const app = require('./app.js')
const uri = process.env.MONGODB_URI || config.connectionString

let server = null
let connection = null

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (connection == null) {
        connection = await mongoose.createConnection(uri, {
            bufferCommands: false,
            bufferMaxEntries: 0,
            useNewUrlParser: true
        });
    }
    
    server = awsServerlessExpress.createServer(app)

    return awsServerlessExpress.proxy(server, event, context)
}