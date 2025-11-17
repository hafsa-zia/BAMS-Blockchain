const Student = require("../models/Student");
const ClassModel = require("../models/Class");
const Department = require("../models/Department");
const Block = require("../models/Block");
const DIFFICULTY = 4;

exports.createStudent = async (req, res) => {
  try {
    const { name, rollNumber, departmentId, classId } = req.body;
    if (!name || !rollNumber || !departmentId || !classId) return res.status(400).json({ message: "Missing fields" });

    const cls = await ClassModel.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    // genesis prev hash = last hash of parent class chain
    const parentLast = cls.chain[cls.chain.length - 1];
    const genesis = new Block(0, { type: "student_genesis", name, rollNumber, classId, departmentId }, Date.now(), parentLast.hash);
    genesis.mineBlock(DIFFICULTY);

    const student = new Student({ name, rollNumber, departmentId, classId, chain: [genesis] });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });

    const { updates } = req.body;
    const last = student.chain[student.chain.length - 1];
    const newIndex = student.chain.length;
    const blockPayload = { type: "student_update", updates };

    const block = new Block(newIndex, blockPayload, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);
    student.chain.push(block);

    // update top-level fields for quick reads (the chain stores full history)
    if (updates?.name) student.name = updates.name;
    if (updates?.rollNumber) student.rollNumber = updates.rollNumber;
    if (updates?.classId) student.classId = updates.classId;
    if (updates?.departmentId) student.departmentId = updates.departmentId;

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });

    const last = student.chain[student.chain.length - 1];
    const newIndex = student.chain.length;
    const blockPayload = { type: "student_deleted", status: "deleted" };

    const block = new Block(newIndex, blockPayload, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);
    student.chain.push(block);
    await student.save();
    res.json({ message: "Student marked deleted", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentChain = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json({ chain: student.chain });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
