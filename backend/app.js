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

// ---------- CORS (Vercel-friendly) ----------
const allowedOrigins = [
  "http://localhost:3000",
  "https://bams-blockchain-bb73.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman or server-to-server
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// ---------- MIDDLEWARE ----------
app.use(bodyParser.json());

// ---------- ROUTES ----------
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => res.send("BAMS Backend Running"));

// ---------- ERROR HANDLING ----------
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message });
});

module.exports = app;
