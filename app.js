const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('./_helpers/jwt')
const errorHandler = require('./_helpers/error-handler')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// use JWT auth to secure the api
app.use(jwt())

// api routes
app.use('/users', require('./users/users.controller'))
app.use('/images', require('./images/image.controller'))
app.use('/hats', require('./hats/hats.controller'))
app.use('/content', require('./content/content.controller'))

// global error handler
app.use(errorHandler)

module.exports = app