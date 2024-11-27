// mongoose/index.js
const mongoose = require('mongoose');
const axios = require('axios');
const Article = require('./articleModel');

// MongoDB connection function
const connectDB = async () => {
    try {
      // Try connecting to MongoDB
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      // Log the error but don't terminate the app
      console.error('MongoDB connection error:', error);
    }
  };

// Function to fetch articles from API and save to MongoDB
const fetchAndSaveArticles = async () => {
    try {
      const response = await axios.get('https://nfl-football-api.p.rapidapi.com/nfl-news', {
        headers: {
          'x-rapidapi-host': 'nfl-football-api.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        },
      });
  
      const articles = response.data.articles;
  
      // Save articles to MongoDB, checking for duplicates based on the headline
      const savedArticles = [];
      for (let article of articles) {
        const existingArticle = await Article.findOne({ headline: article.headline });
  
        if (!existingArticle) {
          const newArticle = new Article({
            headline: article.headline,
            description: article.description,
            lastModified: new Date(article.lastModified),
            published: new Date(article.published),
            images: article.images.map((img) => ({
              name: img.name,
              caption: img.caption,
              alt: img.alt,
              credit: img.credit,
              url: img.url,
              height: img.height,
              width: img.width,
            })),
            premium: article.premium,
            byline: article.byline,
          });
  
          await newArticle.save();
          savedArticles.push(newArticle);
        }
      }
  
      return savedArticles;
    } catch (error) {
      console.error('Error fetching or saving articles:', error);
      throw error;
    }
  };

// Function to fetch articles from the MongoDB database
const fetchArticlesFromDB = async (page, limit) => {
    const skip = (page - 1) * limit;  // Calculate the number of articles to skip based on the page
  
    try {
      // Fetch articles with pagination (limit and skip)
      const articles = await Article.find()
        .skip(skip)
        .limit(limit)
        .sort({ published: -1 });  // Sort by the most recent first
      return articles;
    } catch (error) {
      console.error('Error fetching articles from DB:', error);
      throw error;
    }
  };

module.exports = { connectDB, fetchAndSaveArticles, fetchArticlesFromDB };
