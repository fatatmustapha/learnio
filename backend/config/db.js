import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // change if you have password
  database: "learnio_db",
});

db.connect((err) => {
  if (err) {
    console.error(" XX Database connection failed:", err);
  } else {
    console.log(" Connected to MySQL database !!");
  }
});

export default db;