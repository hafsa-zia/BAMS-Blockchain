const ClassModel = require("../models/Class");
const Department = require("../models/Department");
const Block = require("../models/Block");
const DIFFICULTY = 4;

exports.createClass = async (req, res) => {
  try {
    const { name, departmentId } = req.body;
    if (!name || !departmentId) return res.status(400).json({ message: "Missing" });

    const dept = await Department.findById(departmentId);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    // genesis prev hash = last hash of parent department chain
    const parentLast = dept.chain[dept.chain.length - 1];
    const genesis = new Block(0, { type: "class_genesis", name, departmentId }, Date.now(), parentLast.hash);
    genesis.mineBlock(DIFFICULTY);

    const cls = new ClassModel({ name, departmentId, chain: [genesis] });
    await cls.save();
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Not found" });

    const { updates } = req.body;
    const last = cls.chain[cls.chain.length - 1];
    const newIndex = cls.chain.length;
    const blockPayload = { type: "class_update", updates };

    const block = new Block(newIndex, blockPayload, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);
    cls.chain.push(block);
    if (updates?.name) cls.name = updates.name;
    await cls.save();
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Not found" });

    const last = cls.chain[cls.chain.length - 1];
    const newIndex = cls.chain.length;
    const blockPayload = { type: "class_deleted", status: "deleted" };

    const block = new Block(newIndex, blockPayload, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);
    cls.chain.push(block);
    await cls.save();
    res.json({ message: "Class marked deleted", class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
