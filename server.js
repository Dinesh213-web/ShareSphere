const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const User = require("./models/User");

dotenv.config();

// Fix DNS issue
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Database Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err.message);
});

// Home Route
app.get("/", (req, res) => {
    res.send("ShareSphere Backend is Running");
});
app.post("/register", async (req, res) => {

    const { name, email, rollNumber, department, year, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !rollNumber || !department || !year || !password) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid Email"
        });
    }

    // Password validation
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    try {

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            rollNumber,
            department,
            year,
            password
        });

        await user.save();

        res.status(201).json({
            message: "Registration Successful"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});