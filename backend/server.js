// server.js
import db from "./config/db.js";
import express from "express";//to create server
import cors from "cors";//allow frontend to talk to backend
import dotenv from "dotenv";//read environment variables
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";


const app = express(); //my server object

// Middleware
app.use(cors()); //allows requests from frontend
app.use(express.json());//allows server to read JSON from requests
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/quiz", quizRoutes);
app.use("/progress", progressRoutes);
app.use("/gamification", gamificationRoutes);
dotenv.config();

// Test route
app.get("/", (req, res) => {
  res.send(" Learnio API is running...");
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});//starts server