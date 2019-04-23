const db = require('../_helpers/db')
const { generatePresignedUrl, deleteFileHandler } = require('../_helpers/fileUpload-handler')
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

const update = async ({ page, navigation }) => {
    const content = (await getAll())[0]

    let response = {
        success: true,
        presignedUrls: []
    }

    if (page.data.hasOwnProperty('images')) {
        for (let index = 0; index < page.data.images.length; index++) {
            const { id, path, mimeType } = page.data.images[index]
            if (mimeType) {
                const { success, url, key } = await generatePresignedUrl(mimeType)

                if (success) {
                    deleteFileHandler(path)
                    page.data.images[index] = {
                        id,
                        path: key
                    }
                    response.presignedUrls.push({ id, url })
                } else {
                    response.success = false
                }
            }
        }
    }

    const pages = content.data.pages.map(_ => {
        if (_.slug === page.slug) {
            return page
        }
        return _
    })

    const contentProps = { data: { pages, navigation } }

    Object.assign(content, contentProps)

    content.markModified('data')

    if (response.success) {
        await content.save()
    }

    return {
        content,
        ...response
    }
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