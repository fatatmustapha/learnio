import db from "../config/db.js";
import bcrypt from "bcrypt"; //Never store password or PIN directly → we hash them
import jwt from "jsonwebtoken"; //Used to keep user logged in (authentication token)

// ===============================
// REGISTER PARENT
// ===============================
export const registerParent = async (req, res) => {
  const { name, email, password } = req.body; 
  // Get data from frontend

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const checkQuery = "SELECT * FROM parents WHERE email = ?";

    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password (we NEVER store plain password)
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO parents (name, email, password_hash)
        VALUES (?, ?, ?)
      `;
      // Save user in database

      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error registering parent" });
        }

        res.json({ message: "Parent registered successfully" });
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// ===============================
// LOGIN PARENT
// ===============================
export const loginParent = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `SELECT * FROM parents WHERE email = ?`;

  db.query(query, [email], async (err, results) => {

    // Database error
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // User not found
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const parent = results[0];

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, parent.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: parent.parent_id, role: "parent" }, 
      process.env.JWT_SECRET, //NEVER hardcode secrets
      { expiresIn: "1h" }
    );

    // Send token to frontend
    res.json({ message: "Login successful", token });
  });
};



// ===============================
// LOGIN KID (PIN)
// ===============================
export const loginKid = async (req, res) => {
  const { username, pin } = req.body;

  // Validation
  if (!username || !pin) {
    return res.status(400).json({ message: "Username and PIN are required" });
  }

  const query = `SELECT * FROM kids WHERE username = ?`;

  db.query(query, [username], async (err, results) => {

    // Database error
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // Kid not found
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid username or PIN" });
    }

    const kid = results[0];

    // Compare entered PIN with hashed PIN
    const isMatch = await bcrypt.compare(pin, kid.pin_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or PIN" });
    }

    // Send success response
    const token = jwt.sign(
  { id: kid.kid_id, role: "kid" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.json({
  message: "Kid login successful",
  token,
});
  });
};