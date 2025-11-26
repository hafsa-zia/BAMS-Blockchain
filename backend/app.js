// backend/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const departmentRoutes = require("./routes/departments");
const classRoutes = require("./routes/classes");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ---------- CORS FIX ----------
const allowedOrigins = [
  "http://localhost:3000",
  "https://bams-blockchain-bb73.vercel.app", // your frontend URL
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
// Or you could simply do: app.use(cors({ origin: allowedOrigins }));

// ---------- MIDDLEWARE ----------
app.use(bodyParser.json());

// ---------- ROUTES ----------
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => res.send("BAMS Backend Running"));

module.exports = app;
