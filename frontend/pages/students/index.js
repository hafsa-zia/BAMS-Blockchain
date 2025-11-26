// frontend/pages/students/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getStudents,
  updateStudent,
  deleteStudent,
} from "../../utils/api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRoll, setEditRoll] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditName(s.name || "");
    setEditRoll(s.rollNumber || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditRoll("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim() || !editRoll.trim()) return;
    try {
      await updateStudent(id, {
        updates: { name: editName, rollNumber: editRoll },
      });
      setEditingId(null);
      setEditName("");
      setEditRoll("");
      fetchStudents();
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Mark this student as deleted?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="page-bg">
      <div className="page-container">
        <h1 className="page-title">Students</h1>
        <p className="page-subtitle">
          Each student has a personal blockchain where attendance blocks are
          appended.
        </p>

        {students.length === 0 ? (
          <p className="muted">No students found.</p>
        ) : (
          <div className="space-y-4">
            {students.map((s) => (
              <div key={s._id} className="list-card">
                <div className="flex-1">
                  {editingId === s._id ? (
                    <>
                      <input
                        className="input mb-2"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name"
                      />
                      <input
                        className="input mb-1"
                        value={editRoll}
                        onChange={(e) => setEditRoll(e.target.value)}
                        placeholder="Roll number"
                      />
                      <div className="muted">
                        Editing student metadata; previous states remain
                        on-chain.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-slate-100">
                        {s.name}
                      </div>
                      <div className="text-sm text-slate-300">
                        Roll: {s.rollNumber}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {editingId === s._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(s._id)}
                        className="btn-primary px-3 py-1.5 text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/students/${s._id}`}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => startEdit(s)}
                        className="btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
