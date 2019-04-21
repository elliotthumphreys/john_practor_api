const db = require('../_helpers/db')
const fs = require('fs')
const { deleteFileHandler } = require('../_helpers/fileUpload-handler')
const Content = db.Content

const getAll = async () => {
    return await Content.find()
}

const add = async () => {
    let content = new Content()

    content.data = {
        "pages": [
            {
                "name": "Home",
                "slug": "home",
                "data": {
                    "header-top": ["", "text"],
                    "header-bottom": ["", "text"],
                    "images": [
                        {
                            "id": "coverImage",
                            "path": ""
                        }
                    ],
                }
            },
            {
                "name": "Collection",
                "slug": "collection",
                "data": {}
            },
            {
                "name": "About",
                "slug": "about",
                "data": {
                    "title": ["", "text"],
                    "body": ["", "textarea"]
                }
            },
            {
                "name": "Contact",
                "slug": "contact",
                "data": {
                    "title": ["", "text"],
                    "body": ["", "textarea"]
                }
            },
            {
                "name": "Terms",
                "slug": "terms",
                "data": {
                    "title": ["", "text"],
                    "body": ["", "textarea"]
                }
            }
        ],
        "navigation": []
    }

    await content.save()
}

const update = async (files, fields) => {
    const oldContent = (await getAll())[0]

    let page = oldContent.data.pages.find(_ => _.slug === fields.slug)

    for (let key in fields) {
        if (key !== 'slug' && key !== 'navigation') {
            page.data[key][0] = fields[key]
        }
    }

    if(page.data.hasOwnProperty('images')){
        let replacedImages = []
        files.forEach(file => {
            replacedImages = [...replacedImages, ...page.data.images.filter(image => {
                if (image.id === file.fieldname) {
                    deleteFileHandler(image.path)
                    return true
                } else {
                    return false
                }
            })]
        })

        page.data.images = page.data.images.map(image => {
            if (replacedImages.map(_ => _.id).includes(image.id)) {
                return {
                    id: image.id,
                    path: files.filter(_ => _.fieldname === image.id)[0].key
                }
            } else {
                return image
            }
        })
    }

    const pages = oldContent.data.pages.map(_ => {
        if (_.slug === fields.slug) {
            return page
        }
        return _
    })

    const contentProps = { data: { pages, navigation: [...JSON.parse(fields['navigation'])] } }

    Object.assign(oldContent, contentProps)

    oldContent.markModified('data')

    await oldContent.save()

    return oldContent
}

const _delete = async () => {
    const content = (await getAll())[0]

    //delete old images
    
    await content.remove()
}

module.exports = {
    getAll,
    add,
    update,
    _delete
}