require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require('cors');
const { connectDB } = require('./db');

const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/courses');
const { adminRouter } = require('./routes/admin');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
main();

// Routes
app.use("/user", userRouter);
app.use("/courses", courseRouter);
app.use('/admin', adminRouter);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: "Course Selling App Backend is Running!" });
});