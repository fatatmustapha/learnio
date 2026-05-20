import db from "./config/db.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
  try {
    const email = "admin@learnio.com";
    const password = "123456";
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `
      UPDATE admins
      SET password_hash = ?
      WHERE email = ?
      `,
      [hash, email]
    );

    console.log("Admin password updated successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();
  } catch (error) {
    console.error("Error updating admin:", error);
    process.exit(1);
  }
};

createAdmin();