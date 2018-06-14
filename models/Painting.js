const mongoose = require('mongoose')
const { Schema } = mongoose

const PaintingSchema = new Schema({
  name: String,
  url: String,
  technique: String
})

module.exports = mongoose.model('Painting', PaintingSchema)
