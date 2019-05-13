const express = require('express')
const router = express.Router()
const service = require('./content.service.js')

const getAll = (request, response, next) => {
    service
        .getAll()
        .then(content => response.json(content))
        .catch(error => next(error))
}

const add = (request, response, next) => {
    service
        .add(request.body)
        .then(() => response.json({message: 'success'}))
        .catch(error => next(error))
}

const update = (request, response, next) => {
    service
        .update(request.body)
        .then(_ => response.json(_))
        .catch(error => next(error))
}

const _delete = (request, response, next) => {
    service
        ._delete(request.params.id)
        .then(() => response.json({}))
        .catch(error => next(error))
}


router.get('/', getAll)
router.post('/', add)
router.put('/', update)
router.delete('/', _delete)

module.exports = router 