const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4')

const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: 'us-east-1'
});

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

const storageS3 = multerS3({
    s3: s3,
    bucket: 'medium-test',
    acl: 'public-read',
    key: function (request, file, callback) {
        callback(null, `${uuidv4()}.${getExtension(file.mimetype)}`)
    }
})

const upload = multer({ storage })

const fileUploadHandler = upload.array('images', 10)
const anyFileUploadHandler = upload.any()

module.exports = {
    fileUploadHandler,
    anyFileUploadHandler
}