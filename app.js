const express = require("express");
const pool = require("./db"); //this imports the database connection
const app = express();
const port = 3000;

app.use(express.json()); //allow app to understand JSON data
app.use(express.urlencoded({ extended: true })); //<------- add this to read the HTML forms
app.use(express.static("public")); //<----- add this to serve our dashboard file

//testing route to check DB connection
app.get("/test-db", async (reg, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "coffee is almost ready!", time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// route to add new book
app.post("/add-book", async (req, res) => {
  try {
    // 1. get the data from the form
    const {
      title,
      author,
      quantity,
      isbn,
      price_retail,
      price_cost,
      vendor,
      format,
    } = req.body;

    // 2. Insert into the database
    // To prevent hacking, use $1, $2, $3, ets. as placeholders for security
    const newBook = await pool.query(
      "INSERT INTO books (title, author, quantity, isbn, price_retail, price_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [title, author, quantity, isbn, price_retail, price_cost, vendor, format],
    );

    //3. send a response (current: sending new book data back)
    res.json(newBook.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/books", async (req, res) => {
  try {
    const allBooks = await pool.query("SELECT * FROM books ORDER BY id ASC");
    res.json(allBooks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
