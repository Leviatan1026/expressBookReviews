const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (async/await)
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve, reject) => {
      if (books) resolve(books);
      else reject(new Error("Books not found"));
    });
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN (async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject(new Error("Book not found"));
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author (async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const filteredBooks = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.author === author);
      if (result.length > 0) resolve(result);
      else reject(new Error("No books found for this author"));
    });
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title (async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const filteredBooks = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.title === title);
      if (result.length > 0) resolve(result);
      else reject(new Error("No books found for this title"));
    });
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject(new Error("Book not found"));
    });
    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;