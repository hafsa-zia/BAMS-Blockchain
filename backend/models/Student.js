const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  createdAt: { type: Date, default: Date.now },
  chain: { type: Array, default: [] }
});

module.exports = mongoose.model("Student", StudentSchema);
