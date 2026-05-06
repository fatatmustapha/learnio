import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// REGISTER PARENT
export const registerParent = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existingParent] = await db.query(
      "SELECT * FROM parents WHERE email = ?",
      [email]
    );

    if (existingParent.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO parents (name, email, password_hash)
      VALUES (?, ?, ?)
      `,
      [full_name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, role: "parent" },
      process.env.JWT_SECRET || "learniosecret",
      { expiresIn: "7d" }
    );

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Learnio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to Learnio!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#0F3D3E;">Welcome to Learnio 🎉</h2>
            <p>Hi ${full_name},</p>
            <p>Your parent account has been created successfully.</p>
            <p>Your child’s learning journey starts now!</p>
            <p style="margin-top:20px;">— Learnio Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log("WELCOME EMAIL ERROR:", emailError.message);
    }

    return res.status(201).json({
      message: "Parent registered successfully",
      token,
      user: {
        parent_id: result.insertId,
        full_name,
        email,
        role: "parent",
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN PARENT
export const loginParent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [parents] = await db.query(
      "SELECT * FROM parents WHERE email = ?",
      [email]
    );

    if (parents.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const parent = parents[0];

    const isMatch = await bcrypt.compare(password, parent.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: parent.parent_id, role: "parent" },
      process.env.JWT_SECRET || "learniosecret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        parent_id: parent.parent_id,
        full_name: parent.name,
        email: parent.email,
        role: "parent",
      },
    });
  } catch (error) {
    console.error("LOGIN PARENT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN KID
export const loginKid = async (req, res) => {
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({ message: "Username and PIN are required" });
  }

  try {
    const [kids] = await db.query("SELECT * FROM kids WHERE username = ?", [
      username,
    ]);

    if (kids.length === 0) {
      return res.status(400).json({ message: "Invalid username or PIN" });
    }

    const kid = kids[0];

    const isMatch = await bcrypt.compare(pin, kid.pin_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or PIN" });
    }

    const token = jwt.sign(
      { id: kid.kid_id, role: "kid" },
      process.env.JWT_SECRET || "learniosecret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Kid login successful",
      token,
      user: {
        kid_id: kid.kid_id,
        parent_id: kid.parent_id,
        username: kid.username,
        role: "kid",
      },
    });
  } catch (error) {
    console.error("LOGIN KID ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [parents] = await db.query(
      "SELECT * FROM parents WHERE email = ?",
      [email]
    );

    if (parents.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await db.query("UPDATE parents SET reset_token = ? WHERE email = ?", [
      token,
      email,
    ]);

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Learnio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Learnio Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#0F3D3E;">Reset Your Password</h2>
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="color:#0F3D3E;">${resetLink}</a>
        </div>
      `,
    });

    return res.json({ message: "Reset email sent" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      UPDATE parents
      SET password_hash = ?, reset_token = NULL
      WHERE reset_token = ?
      `,
      [hashedPassword, token]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PIN
export const forgotPin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  return res.json({
    message: "Forgot PIN feature will be connected later",
  });
};