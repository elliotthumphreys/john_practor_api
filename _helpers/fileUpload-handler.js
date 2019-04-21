const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4')

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: 'eu-west-2'
});

const BUCKET = 'john-proctor-millinery-images'

const s3 = new aws.S3();

const getExtension = mimetype => {
    return [
        ['image/jpeg', 'jpeg'],
        ['image/jpeg', 'jpg'],
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
    bucket: BUCKET,
    acl: 'public-read',
    key: function (request, file, callback) {
        callback(null, `${uuidv4()}.${getExtension(file.mimetype)}`)
    }
})

const upload = multer({ storage: storageS3 })

const fileUploadHandler = upload.array('images', 10)
const anyFileUploadHandler = upload.any()
const deleteFile = async key => {
    if (key !== null && key !== '') {
        s3.deleteObject({
            Bucket: BUCKET,
            Key: key
        }, () => {})
    }
}

module.exports = {
    fileUploadHandler,
    anyFileUploadHandler,
    deleteFileHandler: deleteFile
}