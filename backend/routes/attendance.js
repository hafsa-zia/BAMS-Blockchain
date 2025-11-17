const express = require("express");
const router = express.Router();
const attendanceCtrl = require("../controllers/attendanceController");

// Mark attendance for a student (creates a block in student's chain)
router.post("/mark", attendanceCtrl.markAttendance);

// Get aggregated attendance - simple examples
router.get("/student/:id", attendanceCtrl.getAttendanceForStudent);
router.get("/class/:classId/day/:date", attendanceCtrl.getAttendanceForClassOnDate);

module.exports = router;
