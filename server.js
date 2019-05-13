const mongoose = require('mongoose')
const config = require('./_config/config.json')
const app = require('./app.js')

const uri = process.env.MONGODB_URI || config.connectionString
const startServer = async () => {
    let connection = await mongoose.createConnection(uri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true
    });

    const { PORT = 3000 } = process.env
    app.listen(PORT, function () {
        console.log('Server listening on port ' + PORT)
    })
}

startServer()