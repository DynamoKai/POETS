const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventory_db",
  password: "2143318446", // <--- PUT YOUR POSTGRES PASSWORD HERE
  port: 5432,
});

module.exports = pool;
