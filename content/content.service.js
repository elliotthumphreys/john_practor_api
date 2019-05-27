const mongoose = require('mongoose')
const { generatePresignedUrl, deleteFileHandler } = require('../_helpers/fileUpload-handler')
const Content = require('./content.model')

const getAll = async () => {
    return await Content.find()
}

const get = async id => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return await Content.findById(id)
    }

    throw `Id ${id} is incorrect`
}

const add = async contentJson => {
    let content = new Content()

    Object.assign(content, contentJson)

    await content.save()
}

const update = async (id, { data }) => {
    const content = await get(id)

    let response = {
        success: true,
        presignedUrls: []
    }

    for (let index = 0; index < data.length; index++) {
        const { mimeType, value, name, type } = data[index]
        if (type !== 'image') continue
        if (mimeType) {
            deleteFileHandler(value)

            const { success, url, key } = await generatePresignedUrl(mimeType)
            if (success) {
                data[index] = {
                    name,
                    value: key,
                    type
                }
            } else {
                throw new Error('Content Update: Failed to generate presigned url')
            }

            response.presignedUrls.push({ name, url })
        }
    }

    Object.assign(content, { data })

    content.markModified('data')

    if (response.success) {
        await content.save()
    }

    return {
        content,
        ...response
    }
}

const _delete = async id => {
    let content = await get(id)

    if (content.data.hasOwnProperty('images')) {
        content.data.images.forEach(image =>
            deleteFileHandler(image.path)
        )
    }

    await content.findByIdAndRemove(id)
}

module.exports = {
    get,
    getAll,
    add,
    update,
    delete: _delete
}