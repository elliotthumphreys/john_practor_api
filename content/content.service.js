const db = require('../_helpers/db')
const fs = require('fs')
const Content = db.Content

const getAll = async () => {
    return await Content.find()
}

const add = async (files, fields) => {
    let content = new Content()

    let jsonData = {}

    for (fieldName in fields) {
        jsonData[fieldName] = fields[fieldName]
    }

    jsonData.images = files.map((image, _) => ({
        id: image.fieldname,
        path: image.filename
    }))

    content.data = jsonData

    await content.save()
}

const update = async (files, fields) => {
    let oldContent = (await getAll())[0]

    let contentProps = {data: {}}

    let replacedImages = []
    files.forEach(file => {
        replacedImages = [...replacedImages, ...oldContent.data.images.filter(image => {
            if(image.id === file.fieldname) {
                fs.unlink(`uploads/${image.path}`, () => {})
                return true
            } else {
                return false
            }
        })]
    })

    contentProps.data.images  = oldContent.data.images.map(image => {
        if(replacedImages.map(_ => _.id).includes(image.id)){
            return {
                id: image.id,
                path: files.filter(_ => _.fieldname === image.id)[0].filename
            }
        }else{
            return image
        }
    })

    contentProps = {data: { ...oldContent.data, ...contentProps.data, ...fields }}

    Object.assign(oldContent, contentProps);

    await oldContent.save()

    return oldContent
}

module.exports = {
    getAll,
    add,
    update
}