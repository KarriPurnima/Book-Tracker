const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  rating: { type: Number, min: 1, max: 5 },
  review: String,
  read_date: Date,
  cover_id: String,
}, { timestamps: true });

module.exports = mongoose.model("Book", BookSchema);