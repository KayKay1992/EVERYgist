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
const sitemapRoutes = require("./routes/sitemapRoutes");

const app = express();

// Trust proxy - important for Render deployment to properly detect HTTPS
app.set("trust proxy", 1);

// Allowed origins for CORS
const allowedOrigins = [
  "https://gisthub-lyac.onrender.com", // Your frontend URL
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Alternative local port
];

// Middleware to handle cors issues
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Gist Hub API is running!",
    status: "healthy",
    version: "1.0.0",
    endpoints: {
      posts: "/api/posts",
      comments: "/api/comments",
      auth: "/api/auth",
      dashboard: "/api/dashboard-summary",
      ai: "/api/ai",
      sitemap: "/api/sitemap.xml",
      robots: "/api/robots.txt",
    },
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/posts", blogPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard-summary", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", sitemapRoutes); // Sitemap and robots.txt routes

//serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
