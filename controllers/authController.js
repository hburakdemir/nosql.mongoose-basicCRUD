// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");
const { validateEmail, validatePassword,emailZod } = require("../helpers/validation");

// REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!emailZod(email)) {
    return res
      .status(400)
      .json({ message: "Email must be: email@example.com" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must have at least 8 characters, 1 uppercase, 1 number, 1 special character",
    });
  }

  try {
    const existingUser = await User.findOne({ email }); // Email kayıt olmuş mu kontrol
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email or password wrong" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email or password wrong" });

    const token = jwt.sign(
      { userId: user._id, username: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    const decoded = jwt.decode(token);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      decodedToken: decoded, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login };
