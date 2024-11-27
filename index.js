const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/index");
const { connectDB, fetchAndSaveArticles } = require('./mongoose/index');

const app = express();
const port = 3000; // You can choose any port

connectDB();

fetchAndSaveArticles()
  .then(() => {
    console.log("Articles fetched and saved successfully.");
  })
  .catch((error) => {
    console.error("Error fetching and saving articles:", error);
  });

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
