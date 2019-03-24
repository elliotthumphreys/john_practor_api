const db = require('../_helpers/db')
const fs = require('fs')
const mongoose = require('mongoose')
const Hat = db.Hat

const add = async (files, fields) => {
    let hat = new Hat()

    hat.images = files.map((image, _) => ({
        path: image.filename,
        description: `Image number ${_}`
    })
    )

    for (fieldName in fields) {
        hat[fieldName] = fields[fieldName]
    }

    await hat.save()
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

const update = async (id, files, fields) => {
    let hat = await getById(id)

    let newImages = files.map((image, _) => ({
        path: image.filename,
        description: `Image number ${_}`
    }))

    let oldImages = hat.images.filter(image => fields.deletedImages.split(',').findIndex(id => id == image._id) < 0)

    const images = [...newImages, ...oldImages]

    const imagesToDelete = hat.images.filter(image => fields.deletedImages.split(',').findIndex(id => id == image._id) >= 0)

    imagesToDelete.forEach(image => 
        fs.unlink(`uploads/${image.path}`, () => {})
    )

    const hatProps = { ...fields, images }

    if (hat) {
        Object.assign(hat, hatProps);

        var result = await hat.save()

        return result._doc
    }

    throw `Id ${id} was not found`
}

const _delete = async id => {
    await Hat.findByIdAndRemove(id)
}

module.exports = {
    add,
    getById,
    getAll,
    update,
    _delete
}