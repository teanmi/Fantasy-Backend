const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Fetch user from the database
  const user = await User.findUserByUsername(username);

  const isMatch = await bcrypt.compare(password, user.password);

  // Validate credentials
  if (user && isMatch) {
    return res.status(200).json({ id: user.id, username: user.username });
  }
  return res.status(401).json({ error: "Invalid credentials" });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingEmail = await User.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    User.createUser(username, email, hashedPassword, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(201).json({ message: "User created successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
