const mongoose = require('mongoose')
const { generatePresignedUrl, deleteFileHandler } = require('../_helpers/fileUpload-handler')
const Hat = require('./hat.model')

const add = async data => {
    let hat = new Hat()

    let presignedUrls = {
        images: []
    }

    const { success, message, url, key: coverImageName } = await generatePresignedUrl(data.coverImage)

    if (!success) {
        throw `Error: ${message}`
    }

    const coverPresigedUrl = url
    hat.coverImage = coverImageName

    for (let index = 0; index < data.images.length; index++) {
        const mimeType = data.images[index]
        const { success, message, url, key } = await generatePresignedUrl(mimeType)

        if (!success) {
            throw `Error: ${message}`
        }

        presignedUrls.images.push({
            url,
            mimeType
        })

        hat.images.push({
            path: key
        })
    }

    for (key in data) {
        if (key !== 'images' && key !== 'coverImage') {
            hat[key] = data[key]
        }
    }

    await hat.save()

    return {
        success: true,
        presignedUrls,
        coverPresigedUrl,
        hat
    }
}

const getById = async id => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return await Hat.findById(id)
    }

    throw `Id ${id} is incorrect`
}

const getAll = async () => {
    return await Hat.find().sort('-dateCreated')
}

const update = async (id, data) => {
    let hat = await getById(id)

    if (!hat) {
        throw `Id ${id} was not found`
    }

    let presignedUrls = {
        images: []
    }

    let coverPresigedUrl, coverImageName

    if (data.coverImage !== '') {
        const { success, message, url, key  } = await generatePresignedUrl(data.coverImage)

        if (!success) {
            throw `Error: ${message}`
        }

        coverPresigedUrl = url
        coverImageName = key

        deleteFileHandler(hat.coverImage)
    }

    let newImages = []

    for (let index = 0; index < data.images.length; index++) {
        const mimeType = data.images[index]
        const { success, message, url, key } = await generatePresignedUrl(mimeType)

        if (!success) {
            throw `Error: ${message}`
        }

        presignedUrls.images.push({
            url,
            mimeType
        })

        newImages.push({
            path: key
        })
    }

    let images = hat.images.filter(image => {
        const found = data.deletedImages.find(deletedImage => image._id.toString() === deletedImage)

        if (found) {
            deleteFileHandler(image.path)
            return false
        }

        return true
    })

    images = [...images, ...newImages]

    Object.assign(hat, { ...data, images, coverImage: coverImageName || hat.coverImage })

    await hat.save()

    return { success: true, hat, presignedUrls, coverPresigedUrl }
}

const _delete = async id => {
    let hat = await getById(id)

    hat.images.forEach(image =>
        deleteFileHandler(image.path)
    )

    deleteFileHandler(hat.coverImage)

    await Hat.findByIdAndRemove(id)
}

module.exports = {
    add,
    getById,
    getAll,
    update,
    _delete
}