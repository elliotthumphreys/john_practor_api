const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    data: { type: Object, unique: false, required: false }
})

schema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Content', schema)