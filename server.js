const app = require('./app.js')

const { PORT = 3000 } = process.env

// start local development server
app.listen(PORT, function () {
    console.log('Server listening on port ' + PORT)
})