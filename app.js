require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const Book = require("./models/Book");

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Home route with sorting
app.get("/", async (req, res) => {
  const sortOption = req.query.sort || "-read_date";
  const books = await Book.find().sort(sortOption);
  res.render("index", { books });
});

// Add book form
app.get("/add", (req, res) => res.render("add"));

// Add book
app.post("/add", async (req, res) => {
  const { title, author, rating, review, read_date } = req.body;

  const apiRes = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
  const cover_id = apiRes.data.docs[0]?.cover_i || null;

  await Book.create({ title, author, rating, review, read_date, cover_id });
  res.redirect("/");
});

// Edit form
app.get("/edit/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("edit", { book });
});

// Update book
app.post("/edit/:id", async (req, res) => {
  const { title, author, rating, review, read_date } = req.body;
  await Book.findByIdAndUpdate(req.params.id, { title, author, rating, review, read_date });
  res.redirect("/");
});

// Delete book
app.post("/delete/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://127.0.0.1:${process.env.PORT}`);
});