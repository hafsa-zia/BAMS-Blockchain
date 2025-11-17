const Student = require("../models/Student");
const Block = require("../models/Block");
const ClassModel = require("../models/Class");
const Department = require("../models/Department");
const DIFFICULTY = 4;

/**
 * Mark attendance for a single student.
 * body: { studentId, status } where status is "Present"|"Absent"|"Leave"
 */
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, notedBy } = req.body;
    if (!studentId || !status) return res.status(400).json({ message: "Missing fields" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // build attendance transaction
    const tx = {
      type: "attendance",
      studentId: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
      departmentId: student.departmentId,
      classId: student.classId,
      status,
      notedBy: notedBy || "admin"
    };

    const last = student.chain[student.chain.length - 1];
    const newIndex = student.chain.length;
    const block = new Block(newIndex, tx, Date.now(), last.hash);
    block.mineBlock(DIFFICULTY);

    student.chain.push(block);
    await student.save();

    res.json({ message: "Attendance marked", block });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceForStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    const attendanceBlocks = student.chain.filter(b => b.transactions && b.transactions.type === "attendance");
    res.json({ attendance: attendanceBlocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Example: get attendance for a class for a specific date (yyyy-mm-dd)
 * This is a simple aggregator: finds students in class and filters attendance blocks by date.
 */
exports.getAttendanceForClassOnDate = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const cls = await ClassModel.findById(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const students = await Student.find({ classId: classId });
    const targetDate = new Date(date);
    // normalize date range
    const start = new Date(targetDate.setHours(0,0,0,0));
    const end = new Date(targetDate.setHours(23,59,59,999));

    const results = [];
    for (const s of students) {
      const blocks = s.chain.filter(b => {
        if (!b.transactions || b.transactions.type !== "attendance") return false;
        const ts = new Date(b.timestamp);
        return ts >= start && ts <= end;
      });
      if (blocks.length) {
        results.push({ studentId: s._id, name: s.name, rollNumber: s.rollNumber, blocks });
      }
    }
    res.json({ date, classId, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
