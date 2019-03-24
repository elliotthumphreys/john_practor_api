const multer = require('multer')
const uuidv4 = require('uuid/v4')

const getExtension = mimetype => {
    return [
        ['image/jpeg', 'jpeg'],
        ['image/png', 'png'],
        ['image/svg+xml', 'svg'],
        ['image/tiff', 'tif'],
        ['image/bmp', 'bmp']
    ].find(_ => _[0] === mimetype)[1]
}

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './uploads/')
    },
    filename: (request, file, callback) => {
        callback(null, `${uuidv4()}.${getExtension(file.mimetype)}`)
    }
})

const upload = multer({storage})

const fileUploadHandler = upload.array('images', 10)
const anyFileUploadHandler = upload.any()

module.exports = {
    fileUploadHandler,
    anyFileUploadHandler
}