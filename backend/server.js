const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const path = require("path");
const cors = require("cors");
const User = require("./models/User");
const Resource = require("./models/Resource");
const Borrow = require("./models/Borrow");

dotenv.config({ path: path.resolve(__dirname, ".env") });

// Configure DNS and Connect to Database
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && mongoUri.startsWith("mongodb+srv://")) {
    const parts = mongoUri.split("@");
    if (parts.length > 1) {
      const hostAndQuery = parts[1];
      const host = hostAndQuery.split("/")[0].split("?")[0];
      const srvRecord = `_mongodb._tcp.${host}`;
      try {
        await dns.promises.resolveSrv(srvRecord);
      } catch (err) {
        console.log(
          "Default DNS lookup failed. Setting fallback DNS servers...",
        );
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      }
    }
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Database Connected");
  } catch (err) {
    console.log("MongoDB Connection Error:", err.message);
  }
};

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
connectDB();

// Home Route
app.get("/", (req, res) => {
  res.send("ShareSphere Backend is Running");
});

// Register Route
app.post("/register", async (req, res) => {
  try {
    let { name, email, rollNumber, department, year, password } = req.body;

    if (!name || !email || !rollNumber || !department || !year || !password) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    rollNumber = rollNumber.trim().toUpperCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address.",
      });
    }

    const rollRegex = /^2\d76\d[A-Z]\d{4}$/;

    if (!rollRegex.test(rollNumber)) {
      return res.status(400).json({
        message: "Invalid roll number.",
      });
    }

    if (year < 1 || year > 4) {
      return res.status(400).json({
        message: "Year must be between 1 and 4.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or Roll Number already exists.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      rollNumber,
      department,
      year,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      message: "Registration Successful.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    let { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    rollNumber = rollNumber.trim().toUpperCase();

    // Find user by Roll Number
    const user = await User.findOne({ rollNumber });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Roll Number.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Password.",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login Successful.",
      token,
      user: {
        name: user.name,
        rollNumber: user.rollNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Resource
app.post("/add-resource", async (req, res) => {

    try {

        const {
            title,
            category,
            description,
            condition,
            ownerRollNumber,
            image
        } = req.body;

        if (
            !title ||
            !category ||
            !description ||
            !condition ||
            !ownerRollNumber
        ) {

            return res.status(400).json({
                message: "Please fill all fields."
            });

        }

        const resource = new Resource({

            title,
            category,
            description,
            condition,
            ownerRollNumber,
            image

        });

        await resource.save();

        res.status(201).json({
            message: "Resource Added Successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

//View all resources
app.get("/resources", async (req, res) => {

    try {

        const resources = await Resource.find();

        res.status(200).json(resources);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

//single Resource
app.put("/resource/:id", async (req, res) => {

    try {

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found."
            });
        }

        res.json({
            message: "Resource Updated Successfully.",
            resource
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

//Delete
app.delete("/resource/:id", async (req, res) => {

    try {

        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found."
            });
        }

        res.json({
            message: "Resource Deleted Successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

//Borrow
app.post("/borrow", async (req, res) => {

    try {

        const {
            resourceId,
            borrowerRollNumber
        } = req.body;

        if (!resourceId || !borrowerRollNumber) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found."
            });
        }

        const borrow = new Borrow({

            resourceId,
            borrowerRollNumber,
            ownerRollNumber: resource.ownerRollNumber

        });

        await borrow.save();

        res.status(201).json({
            message: "Borrow Request Sent Successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
app.get("/borrow-requests", async (req, res) => {

    try {

        const requests = await Borrow.find().populate("resourceId");

        res.status(200).json(requests);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
//Approve
app.put("/borrow/:id/approve", async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow request not found."
      });
    }

    borrow.status = "Approved";
    await borrow.save();

    await Resource.findByIdAndUpdate(
      borrow.resourceId,
      { status: "Borrowed" }
    );

    res.json({
      message: "Borrow request approved successfully."
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
//Reject
app.put("/borrow/:id/reject", async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow request not found."
      });
    }

    borrow.status = "Rejected";
    await borrow.save();

    res.json({
      message: "Borrow request rejected successfully."
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
// Start server on Vercel assigned port or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
