const mongoose = require('mongoose');

// Define the Article schema
const articleSchema = new mongoose.Schema({
  headline: String,
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

// Create and export the Article model
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
