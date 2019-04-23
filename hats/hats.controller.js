const express = require('express')
const router = express.Router()
const service = require('./hat.service.js')

const add = (request, response, next) => {
    service
        .add(request.body)
        .then(_ => response.json(_))
        .catch(error => next(error))
}

const getById = (request, response, next) => {
    service
        .getById(request.params.id)
        .then(hat => hat ? response.json(hat) : response.sendStatus(404))
        .catch(error => next(error))
}

const getAll = (request, response, next) => {
    service
        .getAll()
        .then(hats => response.json(hats))
        .catch(error => next(error))
}

const update = (request, response, next) => {
    service
        .update(request.params.id, request.body)
        .then(_ => response.json(_))
        .catch(error => next(error))
}

const _delete = (request, response, next) => {
    service
        ._delete(request.params.id)
        .then(() => response.json({}))
        .catch(error => next(error))
}

router.post('/', add)
router.get('/', getAll)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/:id', _delete)

module.exports = router 