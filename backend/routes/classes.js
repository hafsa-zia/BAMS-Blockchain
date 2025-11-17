const express = require("express");
const router = express.Router();
const classCtrl = require("../controllers/classController");

// Create class
router.post("/", classCtrl.createClass);

// Get all classes
router.get("/", classCtrl.getAllClasses);

// Get class by ID
router.get("/:id", classCtrl.getClassById);

// Update class
router.post("/:id/update", classCtrl.updateClass);

// Delete class
router.post("/:id/delete", classCtrl.deleteClass);

module.exports = router;
