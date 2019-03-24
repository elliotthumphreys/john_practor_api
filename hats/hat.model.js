const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String, unique: false, required: false },
    description: { type: String, unique: false, required: true },
    price: { type: Number, unique: false, required: true },
    dateCreated: { type: Date, default: Date.now() },
    category: { type: String, unique: false, required: true },
    credit: { type: String, unique: false, required: false },
    images: [
        {
            path: { type: String, unique: false, required: true },
            description: { type: String, unique: false, required: true }
        }
    ]
})

schema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Hat', schema)