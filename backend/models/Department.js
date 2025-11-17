const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  chain: { type: Array, default: [] } // each element is a serialized Block (plain object)
});

module.exports = mongoose.model("Department", DepartmentSchema);
