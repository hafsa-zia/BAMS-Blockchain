// Example validation function for multi-layer validation (can be exposed via API later)
const Department = require("../models/Department");
const ClassModel = require("../models/Class");
const Student = require("../models/Student");

const CryptoJS = require("crypto-js");

function recalculatedHash(block) {
  return CryptoJS.SHA256(
    String(block.index) + String(block.timestamp) + JSON.stringify(block.transactions) + String(block.prevHash) + String(block.nonce)
  ).toString();
}

async function validateAll() {
  const depts = await Department.find();
  const classes = await ClassModel.find();
  const students = await Student.find();

  const errors = [];

  // validate department chains
  for (const d of depts) {
    for (let i = 1; i < d.chain.length; i++) {
      const current = d.chain[i];
      const prev = d.chain[i-1];
      if (current.prevHash !== prev.hash) errors.push({ type: "dept_prev_mismatch", department: d._id, index: i });
      if (current.hash !== recalculatedHash(current)) errors.push({ type: "dept_hash_mismatch", department: d._id, index: i });
      if (!current.hash.startsWith("0000")) errors.push({ type: "dept_pow_invalid", department: d._id, index: i });
    }
  }

  // class and student chain checks would follow similar pattern plus verifying genesis prevHashes link to parent latest

  return errors;
}

module.exports = { validateAll };
