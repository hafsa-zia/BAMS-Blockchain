// backend/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const departmentRoutes = require("./routes/departments");
const classRoutes = require("./routes/classes");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");

// Connect to MongoDB (Atlas)
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Health/base route
app.get("/", (req, res) => res.send("BAMS Backend Running"));

module.exports = app;
