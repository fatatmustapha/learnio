import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ===============================
// REGISTER PARENT
// ===============================
export const registerParent = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkQuery = "SELECT * FROM parents WHERE email = ?";

    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO parents (name, email, password_hash)
        VALUES (?, ?, ?)
      `;

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

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `SELECT * FROM parents WHERE email = ?`;

  db.query(query, [email], async (err, results) => {

    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const parent = results[0];

    const isMatch = await bcrypt.compare(password, parent.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: parent.parent_id, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  });
};

// ===============================
// LOGIN KID (PIN)
// ===============================
export const loginKid = async (req, res) => {
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({ message: "Username and PIN are required" });
  }

  const query = `SELECT * FROM kids WHERE username = ?`;

  db.query(query, [username], async (err, results) => {

    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid username or PIN" });
    }

    const kid = results[0];

    const isMatch = await bcrypt.compare(pin, kid.pin_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or PIN" });
    }

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



// =====================================
//  FORGOT PASSWORD (SEND EMAIL)
// =====================================
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM parents WHERE email = ?", [email], async (err, results) => {

    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    // Save token in DB
    db.query(
      "UPDATE parents SET reset_token = ? WHERE email = ?",
      [token, email]
    );

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: "Learnio",
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click below to reset:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Reset email sent" });
  });
};



// =====================================
// RESET PASSWORD
// =====================================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "UPDATE parents SET password_hash = ?, reset_token = NULL WHERE reset_token = ?",
    [hashedPassword, token],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error resetting password" });

      res.json({ message: "Password updated successfully" });
    }
  );
};

export const forgotPin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if parent exists
    db.query(
      "SELECT * FROM parents WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Parent not found" });
        }

        // Generate reset token
        const token = Math.random().toString(36).substring(2, 15);

        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        // Save token
        db.query(
          "UPDATE parents SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
          [token, expiry, email],
          async (err2) => {
            if (err2) {
              return res.status(500).json({ message: "Error saving token" });
            }

            // Send email (SIMPLIFIED)
            console.log("PIN reset link:");
            console.log(`http://localhost:3000/reset-pin/${token}`);

            res.json({
              message: "Reset PIN link sent to your email",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};