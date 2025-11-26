// frontend/pages/classes/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getClassById,
  createStudent,
  getStudents,
  updateClass,
  deleteClass,
} from "../../utils/api";
import Link from "next/link";

export default function ClassDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [cls, setCls] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    if (id) {
      fetchClass();
      fetchStudents();
    }
  }, [id]);

  const fetchClass = async () => {
    try {
      const res = await getClassById(id);
      setCls(res.data);
      setNewClassName(res.data?.name || "");
    } catch (err) {
      console.error("Error loading class:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents((res.data || []).filter((s) => s.classId === id));
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  const handleAddStudent = async () => {
    if (!studentName.trim() || !rollNumber.trim() || !cls) return;
    try {
      await createStudent({
        name: studentName,
        rollNumber,
        classId: id,
        departmentId: cls.departmentId,
      });
      setStudentName("");
      setRollNumber("");
      fetchStudents();
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Failed to create student");
    }
  };

  const handleUpdateClass = async () => {
    if (!newClassName.trim()) return;
    try {
      await updateClass(id, { updates: { name: newClassName } });
      fetchClass();
    } catch (err) {
      console.error("Error updating class:", err);
      alert("Failed to update class");
    }
  };

  const handleDeleteClass = async () => {
    if (!window.confirm("Mark this class as deleted?")) return;
    try {
      await deleteClass(id);
      router.push("/classes");
    } catch (err) {
      console.error("Error deleting class:", err);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="page-bg">
      <div className="page-container">
        <h2 className="page-title">Class Details</h2>
        <p className="page-subtitle">
          Students in this class form their own child blockchains linked to this
          chain.
        </p>

        {cls ? (
          <div className="card p-4 mb-6">
            <div className="mb-2 muted">
              Class Chain Blocks: {cls.chain?.length || 0}
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="input flex-1"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <button
                onClick={handleUpdateClass}
                className="btn-primary px-3 py-1.5 text-xs"
              >
                Update
              </button>
              <button
                onClick={handleDeleteClass}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="muted">Loading...</div>
        )}

        {/* Add Student */}
        <div className="card p-4 mb-6">
          <h3 className="section-title">Add Student</h3>
          <p className="muted mb-2">
            Creating a student here will generate a new student chain using this
            class&apos;s latest hash.
          </p>
          <div className="flex mt-2 gap-2">
            <input
              placeholder="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="input flex-1"
            />
            <input
              placeholder="Roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="input flex-1"
            />
            <button
              onClick={handleAddStudent}
              className="btn-primary px-3 py-2 text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Students list */}
        <div>
          <h3 className="section-title">Students</h3>
          {students.length === 0 ? (
            <div className="muted">No students yet.</div>
          ) : (
            <div className="space-y-3">
              {students.map((s) => (
                <div
                  key={s._id}
                  className="list-card"
                >
                  <div>
                    <div className="font-semibold text-slate-100">
                      {s.name}
                    </div>
                    <div className="muted">Roll: {s.rollNumber}</div>
                  </div>
                  <Link
                    href={`/students/${s._id}`}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
