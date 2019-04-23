const express = require('express')
const router = express.Router()
const service = require('./image.service.js')

const generatePresignedUrl = ({ body: { mimeType } }, response, next) => {
    service
        .generatePresignedUrl(mimeType)
        .then(content => response.json(content))
        .catch(error => next(error))
}

router.get('/', generatePresignedUrl)

module.exports = router 