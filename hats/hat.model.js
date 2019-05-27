const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    description: { type: String, unique: false, required: true },
    dateCreated: { type: Date, default: Date.now() },
    category: { type: String, unique: false, required: true },
    credit: { type: String, unique: false, required: false },
    coverImage: { type: String, unique: false, required: true },
    images: [
        {
            path: { type: String, unique: false, required: true }
        }
    ]
})

const index = {
    category: 'text',
    credit: 'text',
    dateCreated: 'text',
    'images.path': 1
}

schema.index(index);

schema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Hat', schema)