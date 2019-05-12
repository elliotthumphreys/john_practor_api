const awsServerlessExpress = require('aws-serverless-express')
const mongoose = require('mongoose')
const config = require('./_config/config.json')
const uri = process.env.MONGODB_URI || config.connectionString
const server = null
const app = null

global.db = null

const createApp = async () => {
    if (global.db == null) {
        global.db = await mongoose.createConnection(uri, {
            bufferCommands: false,
            bufferMaxEntries: 0,
            useNewUrlParser: true
        });
        app = null
    }

    if(app == null) app = require('./app.js')
}

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await createApp()
    
    server = awsServerlessExpress.createServer(app)

    return awsServerlessExpress.proxy(server, event, context)
}