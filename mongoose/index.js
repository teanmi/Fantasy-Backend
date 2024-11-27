const mongoose = require('mongoose');
const axios = require('axios');
const Article = require('./articleModel');

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
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

    // Save articles to MongoDB
    const savedArticles = await Article.insertMany(
      articles.map((article) => ({
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
      }))
    );

    return savedArticles;
  } catch (error) {
    console.error('Error fetching or saving articles:', error);
    throw error; // Rethrow to be handled by the caller
  }
};

module.exports = { connectDB, fetchAndSaveArticles };
