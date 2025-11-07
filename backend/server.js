const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
// Load environment variables: prefer .env, fallback to .env.local
const envFile = fs.existsSync(path.join(__dirname, ".env"))
  ? path.join(__dirname, ".env")
  : fs.existsSync(path.join(__dirname, ".env.local"))
  ? path.join(__dirname, ".env.local")
  : null;
if (envFile) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

//routes
const blogPostRoutes = require("./routes/blogPostRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
// Middleware to handle cors issues
app.use(
  cors({
    origin: "*", // Allow all origins for simplicity; adjust as needed for security
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/posts", blogPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard-summary", dashboardRoutes);
app.use("/api/ai", aiRoutes);

//serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
