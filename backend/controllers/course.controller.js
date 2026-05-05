import db from "../config/db.js"; // make sure this path is correct

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query("SELECT * FROM courses");

    res.json(courses);
  } catch (error) {
    console.error("ERROR FETCHING COURSES:", error);
    res.status(500).json({ message: "Server error" });
  }
};