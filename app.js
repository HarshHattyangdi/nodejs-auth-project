require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

const express = require("express");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, email, password } = req.body;

    if (!(first_name && last_name && email && password)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Present, please login");
    }

    ecnryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: ecnryptedPassword,
    });

    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All inputs are required");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jst.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(201).json(user);
    }

    res.status(400).send("Invalid User");
  } catch (err) {
    console.log(err);
  }
});

app.use(express.json());

module.exports = app;
