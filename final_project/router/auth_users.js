
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  exists = users.find((user) => user.username == username);
  if (!exists) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find((user) => user.username == username);
  if (user.username == username && user.password == password) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res
      .status(404)
      .json({
        message: "Both username and password are required for logging in",
      });
  }
  usernameIsValid = isValid(username);
  if (usernameIsValid) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, "access", {
        expiresIn: 60 * 60 * 60,
      });
      req.session.authorization = { accessToken, username };
    }else {
      return res.status(401).json({ message: "Invalid login credentials. Please check your username and password." });
    }
  } else {
    res
      .status(404)
      .json({
        message: "User not found. Please check your username and try again.",
      });
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const review = {
    rating: req.body.rating,
    comment: req.body.comment
  }
  const book = books[req.params.isbn]
  if (book) {
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review posted successfully." });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const book = books[req.params.isbn]
  if (book) {
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found." });
    }
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;