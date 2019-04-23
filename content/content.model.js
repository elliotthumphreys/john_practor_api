const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    data: { type: Object, unique: false, required: false }
})

const index = {};
schema.index(index);

schema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Content', schema)