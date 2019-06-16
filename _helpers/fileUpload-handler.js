const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4')

const BUCKET = 'john-proctor-millinery-images'

const S3 = new aws.S3({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: 'eu-west-2',
    signatureVersion: 'v4'
});

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

const generatePresignedUrl = async mimetype => {
    const signedUrlExpireSeconds = 60 * 60;

    const key = `${uuidv4()}.${getExtension(mimetype)}`
    const fullUrl = `incoming/${key}`

    const params = { 
        Bucket: BUCKET, 
        Key: fullUrl, 
        Expires: signedUrlExpireSeconds, 
        ACL: 'public-read', 
        ContentType: mimetype
    };

    return new Promise(resolve => {
        S3.getSignedUrl('putObject', params, (error, url) => {
            if (error) {
                resolve({ success: false, message: 'Pre-Signed URL error', url})
            } else {
                resolve({ success: true, message: 'AWS SDK S3 Pre-signed urls generated successfully.', url, key })
            }
        })
    })
}

const deleteFile = async key => {
    if (key !== null && key !== '') {
        const folders = ['300', '400', '600', '1000', '1920']
        folders.forEach(folder => {
            S3.deleteObject({
                Bucket: BUCKET,
                Key: `${folder}/${key}`
            }, () => {})
        })
    }
}

module.exports = {
    generatePresignedUrl,
    deleteFileHandler: deleteFile
}