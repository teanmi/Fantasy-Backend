// mongoose/articleModel.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  headline: { type: String, unique: true, required: true },
  description: String,
  lastModified: Date,
  published: Date,
  images: [
    {
      name: String,
      caption: String,
      alt: String,
      credit: String,
      url: String,
      height: Number,
      width: Number,
    },
  ],
  premium: Boolean,
  byline: String,
});

// Create the Article model with the schema
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
