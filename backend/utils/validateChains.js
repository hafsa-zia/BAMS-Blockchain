// backend/utils/validateChains.js
const Department = require("../models/Department");
const ClassModel = require("../models/Class");
const Student = require("../models/Student");
const Block = require("../models/Block");

// Recompute hash using the same logic as Block class
function recomputeHash(blockData) {
  // blockData is a plain object from Mongo, not an instance
  const temp = new Block(
    blockData.index,
    blockData.transactions,
    blockData.timestamp,
    blockData.prevHash
  );
  temp.nonce = blockData.nonce;
  return temp.calculateHash();
}

// Generic chain validator (department, class, student chains)
function validateSingleChain(chain, label) {
  const errors = [];

  if (!Array.isArray(chain) || chain.length === 0) {
    errors.push(`${label}: chain is empty or not an array`);
    return { valid: false, errors };
  }

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];

    // 1) Recompute hash
    const recalculated = recomputeHash(block);
    if (recalculated !== block.hash) {
      errors.push(
        `${label}: hash mismatch at index ${block.index}. stored=${block.hash}, recalculated=${recalculated}`
      );
    }

    // 2) Check prevHash linkage (except genesis)
    if (i > 0) {
      const prev = chain[i - 1];
      if (block.prevHash !== prev.hash) {
        errors.push(
          `${label}: prevHash mismatch at index ${block.index}. expected prevHash=${prev.hash}, got=${block.prevHash}`
        );
      }
    }

    // 3) Proof-of-Work: hash must start with "0000"
    if (!block.hash || !block.hash.startsWith("0000")) {
      errors.push(
        `${label}: PoW invalid at index ${block.index}. hash does not start with "0000".`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

async function validateAllChains() {
  const departments = await Department.find().lean();
  const classes = await ClassModel.find().lean();
  const students = await Student.find().lean();

  const deptMap = {};
  departments.forEach((d) => {
    deptMap[d._id.toString()] = d;
  });

  const classMap = {};
  classes.forEach((c) => {
    classMap[c._id.toString()] = c;
  });

  // --- 1) Validate Department chains ---
  const deptResults = departments.map((dept) => {
    const label = `Department(${dept.name})`;
    const chainResult = validateSingleChain(dept.chain || [], label);

    return {
      id: dept._id,
      name: dept.name,
      valid: chainResult.valid,
      errors: chainResult.errors,
    };
  });

  // Build quick lookup for department validity
  const deptValidById = {};
  deptResults.forEach((r) => {
    deptValidById[r.id.toString()] = r.valid;
  });

  // --- 2) Validate Class chains + parent department link ---
  const classResults = classes.map((cls) => {
    const label = `Class(${cls.name})`;
    const chainResult = validateSingleChain(cls.chain || [], label);
    const errors = [...chainResult.errors];

    const dept = deptMap[cls.departmentId?.toString()];
    if (!dept) {
      errors.push(
        `Class(${cls.name}): parent department not found (id=${cls.departmentId})`
      );
    } else {
      // Class genesis must link to some department block hash
      const genesis = (cls.chain || [])[0];
      if (!genesis) {
        errors.push(`Class(${cls.name}): missing genesis block`);
      } else {
        const match = (dept.chain || []).some(
          (b) => b.hash === genesis.prevHash
        );
        if (!match) {
          errors.push(
            `Class(${cls.name}): genesis.prevHash does not match any block.hash in Department(${dept.name}) chain`
          );
        }
      }

      // If department itself is invalid, propagate
      if (!deptValidById[cls.departmentId?.toString()]) {
        errors.push(
          `Class(${cls.name}): parent department chain is invalid (propagated)`
        );
      }
    }

    return {
      id: cls._id,
      name: cls.name,
      departmentId: cls.departmentId,
      valid: errors.length === 0,
      errors,
    };
  });

  // Build quick lookup for class validity
  const classValidById = {};
  classResults.forEach((r) => {
    classValidById[r.id.toString()] = r.valid;
  });

  // --- 3) Validate Student chains + parent class link ---
  const studentResults = students.map((st) => {
    const label = `Student(${st.name}, roll=${st.rollNumber})`;
    const chainResult = validateSingleChain(st.chain || [], label);
    const errors = [...chainResult.errors];

    const cls = classMap[st.classId?.toString()];
    if (!cls) {
      errors.push(
        `Student(${st.name}): parent class not found (id=${st.classId})`
      );
    } else {
      // Genesis must link to some class block hash
      const genesis = (st.chain || [])[0];
      if (!genesis) {
        errors.push(`Student(${st.name}): missing genesis block`);
      } else {
        const match = (cls.chain || []).some(
          (b) => b.hash === genesis.prevHash
        );
        if (!match) {
          errors.push(
            `Student(${st.name}): genesis.prevHash does not match any block.hash in Class(${cls.name}) chain`
          );
        }
      }

      // If class itself is invalid, propagate
      if (!classValidById[st.classId?.toString()]) {
        errors.push(
          `Student(${st.name}): parent class chain is invalid (propagated)`
        );
      }

      // Also check department validity propagation
      const deptValid = deptValidById[st.departmentId?.toString()];
      if (deptValid === false) {
        errors.push(
          `Student(${st.name}): parent department chain is invalid (propagated)`
        );
      }
    }

    return {
      id: st._id,
      name: st.name,
      rollNumber: st.rollNumber,
      departmentId: st.departmentId,
      classId: st.classId,
      valid: errors.length === 0,
      errors,
    };
  });

  const overallValid =
    deptResults.every((d) => d.valid) &&
    classResults.every((c) => c.valid) &&
    studentResults.every((s) => s.valid);

  return {
    overallValid,
    departments: deptResults,
    classes: classResults,
    students: studentResults,
  };
}

module.exports = {
  validateAllChains,
};
