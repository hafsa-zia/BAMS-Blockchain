const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  createdAt: { type: Date, default: Date.now },
  chain: { type: Array, default: [] }
});

module.exports = mongoose.model("Class", ClassSchema);
