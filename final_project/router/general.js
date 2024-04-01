const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    resolve(books);
  });
  promise
    .then((resData) => {
      res.json(resData);
    })
    .catch((err) => {
      res.status(404).json(err.message);
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ message: "Book not found" });
    }
  });
  promise
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    let foundBooks = [];
    for (let [, object] of Object.entries(books)) {
      author = object.author
      if(author.includes(req.params.author)){
        foundBooks.push(object)
      }
    }
    if(foundBooks){
      resolve(foundBooks)
    }else {
      reject({ message: "Book not found" })
    }
  })
  promise
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: err.message });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    let foundBooks = [];
    for (let [, object] of Object.entries(books)) {
      title = object.title
      if(title.includes(req.params.title)){
        foundBooks.push(object)
      }
    }
    if(foundBooks){
      resolve(foundBooks)
    }else {
      reject({ message: "Book not found" })
    }
  })
  promise
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      return res.status(404).json({ message: err.message });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn]
  if(book){
    res.json(book.reviews)
  }else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;