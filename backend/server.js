import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import kidRoutes from "./routes/kid.routes.js";

dotenv.config();

const app = express();

// FIX FOR __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

//  SERVE IMAGES (THIS IS THE REAL FIX)
app.use("/images", express.static(path.join(__dirname, "images")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kid", kidRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Learnio API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});