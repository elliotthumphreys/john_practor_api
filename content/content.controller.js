const express = require('express')
const router = express.Router()
const service = require('./content.service.js')
const helper = require('../_helpers/fileUpload-handler')

const getAll = (request, response, next) => {
    service
        .getAll()
        .then(content => response.json(content))
        .catch(error => next(error))
}

const add = (request, response, next) => {
    service
        .add(request.files, request.body)
        .then(() => response.json({message: 'success'}))
        .catch(error => next(error))
}

const update = (request, response, next) => {
    service
        .update(request.files, request.body)
        .then(content => response.json({content, message: 'success'}))
        .catch(error => next(error))
}

router.get('/', getAll)
router.post('/add', helper.anyFileUploadHandler, add)
router.put('/', helper.anyFileUploadHandler, update)

module.exports = router 