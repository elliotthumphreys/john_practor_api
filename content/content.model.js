const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, unique: false, required: false },
    slug: { type: String, unique: false, required: false },
    type: { type: String, unique: false, required: true },
    data: { type: Array, unique: false, required: true }
})

schema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Content', schema)