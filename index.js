const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/index");

const app = express();
const port = 3000; // You can choose any port

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
