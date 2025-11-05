require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

//routes
const blogPostRoutes = require('./routes/blogPostRoutes');
// const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/authRoutes');
// const dashboardRoutes = require('./routes/dashboard');
// const aiRoutes = require('./routes/ai');


const app = express();
// Middleware to handle cors issues
app.use(cors({
    origin: '*', // Allow all origins for simplicity; adjust as needed for security
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect to MongoDB database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/posts', blogPostRoutes);
// app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/ai', aiRoutes);


//serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {}));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));