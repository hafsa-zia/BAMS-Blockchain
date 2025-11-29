// backend/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const departmentRoutes = require("./routes/departments");
const classRoutes = require("./routes/classes");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const validationRoutes = require("./routes/validation"); // 👈 ADDED

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ---------- CORS: allow everything (for now) ----------
app.use(
  cors({
    origin: "*", // allow ALL origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.options("*", cors()); // handle preflight for all routes

// ---------- BODY PARSER ----------
app.use(bodyParser.json());

// ---------- ROUTES ----------
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/validate", validationRoutes); // 👈 ADDED

// Health/base route
app.get("/", (req, res) => res.send("BAMS Backend Running"));

module.exports = app;
