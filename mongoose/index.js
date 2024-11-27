const mongoose = require('mongoose');
const axios = require('axios');
const Article = require('./articleModel');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };

const fetchAndSaveArticles = async () => {
    try {
      const response = await axios.get('https://nfl-football-api.p.rapidapi.com/nfl-news', {
        headers: {
          'x-rapidapi-host': 'nfl-football-api.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        },
      });
  
      const articles = response.data.articles;
  
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

const fetchArticlesFromDB = async (page, limit) => {
    const skip = (page - 1) * limit;
  
    try {
      const articles = await Article.find()
        .skip(skip)
        .limit(limit)
        .sort({ published: -1 });
      return articles;
    } catch (error) {
      console.error('Error fetching articles from DB:', error);
      throw error;
    }
  };

module.exports = { connectDB, fetchAndSaveArticles, fetchArticlesFromDB };
