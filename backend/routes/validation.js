// backend/routes/validation.js
const express = require("express");
const router = express.Router();
const { validateAllChains } = require("../utils/validateChains");

router.get("/", async (req, res) => {
  try {
    const report = await validateAllChains();
    res.json(report);
  } catch (err) {
    console.error("Error validating chains:", err);
    res.status(500).json({ message: "Validation failed", error: err.message });
  }
});

module.exports = router;
