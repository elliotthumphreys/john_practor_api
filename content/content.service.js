const db = require('../_helpers/db')
const fs = require('fs')
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
                    "body": ["", "textarea"]
                }
            },
            {
                "name": "Contact",
                "slug": "contact",
                "data": {
                    "body": ["", "textarea"]
                }
            },
            {
                "name": "Terms",
                "slug": "terms",
                "data": {
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

    const contentProps = { data: { pages, navigation: [...JSON.parse(fields['navigation'])] } }

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