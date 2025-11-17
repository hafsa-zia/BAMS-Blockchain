const express = require("express");
const router = express.Router();
const studentCtrl = require("../controllers/studentController");

// Create a new student (adds genesis block)
router.post("/", studentCtrl.createStudent);

// Get all students
router.get("/", studentCtrl.getAllStudents);

// Get a student by ID
router.get("/:id", studentCtrl.getStudentById);

// Update a student (append update block)
router.post("/:id/update", studentCtrl.updateStudent);

// Delete a student (append delete block)
router.post("/:id/delete", studentCtrl.deleteStudent);

// Get a student's full blockchain
router.get("/:id/chain", studentCtrl.getStudentChain);

module.exports = router;
