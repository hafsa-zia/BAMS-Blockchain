const Department = require("../models/Department");
const Block = require("../models/Block");

// difficulty for mining
const DIFFICULTY = 4;

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const genesis = new Block(0, { type: "department_genesis", name }, Date.now(), "0");
    genesis.mineBlock(DIFFICULTY);

    const dept = new Department({ name, chain: [genesis] });
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Not found" });

    const { updates } = req.body; // object of updated fields
    const last = dept.chain[dept.chain.length - 1];
    const newIndex = dept.chain.length;
    const blockPayload = { type: "department_update", updates };

    const block = new Block(newIndex, blockPayload, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);
    dept.chain.push(block);
    if (updates?.name) dept.name = updates.name;
    await dept.save();
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Not found" });

    const last = dept.chain[dept.chain.length - 1];
    const newIndex = dept.chain.length;
    const blockPayload = { type: "department_deleted", status: "deleted" };

    const block = new Block(newIndex, blockPayload, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);
    dept.chain.push(block);
    await dept.save();
    res.json({ message: "Department marked deleted", department: dept });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
