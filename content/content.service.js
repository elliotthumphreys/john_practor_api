const db = require('../_helpers/db')
const fs = require('fs')
const Content = db.Content

const getAll = async () => {
    return await Content.find()
}

const add = async (files, fields) => {
    let content = new Content()

    // let jsonData = {}

    // for (fieldName in fields) {
    //     jsonData[fieldName] = fields[fieldName]
    // }

    // jsonData.images = files.map((image, _) => ({
    //     id: image.fieldname,
    //     path: image.filename
    // }))

    content.data = {
        "pages": [
            {
                "name": "Collection",
                "slug": "products-collection",
                "data": {
                    "body": ["some-typescript-body-data", "textarea"],
                    "images": [
                        {
                            "id": "coverImage",
                            "path": "1ffa06a6-04c7-41b1-b438-424c354c457f.png"
                        }
                    ],
                    "page-specific-field-1": ["example field", "text"],
                    "page-specific-field-2": ["example field", "textarea"]
                }
            },
            {
                "name": "Home",
                "slug": "home",
                "data": {
                    "header": ["some-typescript-body-data", "text"],
                    "images": [
                        {
                            "id": "coverImage",
                            "path": "1ffa06a6-04c7-41b1-b438-424c354c457f.png"
                        }
                    ],
                }
            }
        ],
        "navigation": [
            {
                "name": "Home",
                "slug": "home"
            },
            {
                "name": "Weddings",
                "slug": "collection?category=wedding"
            }
        ]
    }

    await content.save()
}

const update = async (files, fields) => {
    const oldContent = (await getAll())[0]

    let page = oldContent.data.pages.find(_ => _.slug === fields.slug)

    for (let key in fields) {
        if (key !== 'slug') {
            page.data[key][0] = fields[key]
        }
    }

    let replacedImages = []
    files.forEach(file => {
        replacedImages = [...replacedImages, ...page.data.images.filter(image => {
            if (image.id === file.fieldname) {
                fs.unlink(`uploads/${image.path}`, () => { })
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
                path: files.filter(_ => _.fieldname === image.id)[0].filename
            }
        } else {
            return image
        }
    })

    const pages = oldContent.data.pages.map(_ => {
        if (_.slug === fields.slug) {
            return page
        }
        return _
    })

    const contentProps = { data: { pages, navigation: oldContent.data.navigation } }

    Object.assign(oldContent, contentProps)

    oldContent.markModified('data')

    await oldContent.save()

    return oldContent
}

module.exports = {
    getAll,
    add,
    update
}