// frontend/pages/students/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getStudent,
  getStudentChain,
  markAttendance,
  updateStudent,
  deleteStudent,
} from "../../utils/api";

export default function StudentDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [student, setStudent] = useState(null);
  const [chain, setChain] = useState([]);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  const [editName, setEditName] = useState("");
  const [editRoll, setEditRoll] = useState("");

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await getStudent(id);
      setStudent(res.data);
      setEditName(res.data?.name || "");
      setEditRoll(res.data?.rollNumber || "");

      const chainRes = await getStudentChain(id);
      setChain(chainRes.data.chain || []);
    } catch (err) {
      console.error("Error loading student:", err);
    }
  };

  const handleMark = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await markAttendance(id, { status });
      await fetchStudent();
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance");
    }
    setLoading(false);
  };

  const handleUpdateStudent = async () => {
    if (!editName.trim() || !editRoll.trim()) return;
    try {
      await updateStudent(id, {
        updates: { name: editName, rollNumber: editRoll },
      });
      fetchStudent();
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student");
    }
  };

  const handleDeleteStudent = async () => {
    if (!window.confirm("Mark this student as deleted?")) return;
    try {
      await deleteStudent(id);
      router.push("/students");
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="page-bg">
      <div className="page-container">
        <h2 className="page-title">Student Detail</h2>
        <p className="page-subtitle">
          Personal blockchain ledger showing all attendance entries linked by
          hashes, timestamps and PoW.
        </p>

        {/* Student Info + Edit */}
        {student ? (
          <div className="card p-4 mb-6">
            <div className="muted mb-2">
              Blocks in student chain: {student.chain?.length || 0}
            </div>
            <div className="flex flex-col gap-2">
              <input
                className="input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
              />
              <input
                className="input"
                value={editRoll}
                onChange={(e) => setEditRoll(e.target.value)}
                placeholder="Roll number"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleUpdateStudent}
                  className="btn-primary px-3 py-1.5 text-xs"
                >
                  Update Student
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="btn-danger"
                >
                  Delete Student
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="muted">Loading student...</div>
        )}

        {/* Mark Attendance */}
        <div className="card p-4 mb-6">
          <h3 className="section-title">Mark Attendance</h3>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select"
            >
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
            </select>
            <button
              onClick={handleMark}
              disabled={loading}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
            >
              {loading ? "Marking..." : "Mark"}
            </button>
          </div>
        </div>

        {/* Blockchain / Attendance Chain */}
        <div>
          <h3 className="section-title">Blockchain (Attendance History)</h3>
          <div className="space-y-3">
            {chain.length === 0 ? (
              <div className="muted">No chain data.</div>
            ) : (
              chain.map((b, idx) => (
                <div key={idx} className="card p-3">
                  <div className="text-sm text-slate-200">
                    Index: <span className="font-mono">{b.index}</span> —{" "}
                    {b.timestamp
                      ? new Date(b.timestamp).toLocaleString()
                      : "No timestamp"}
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Prev Hash:</strong>
                    <div className="truncate font-mono text-[11px] text-slate-300">
                      {b.prevHash}
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Hash:</strong>
                    <div className="truncate font-mono text-[11px] text-emerald-300">
                      {b.hash}
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    <strong>Nonce:</strong>{" "}
                    <span className="font-mono">{b.nonce}</span>
                  </div>
                  <div className="mt-2">
                    <strong>Transaction:</strong>
                    <pre className="text-[11px] bg-slate-900/80 border border-slate-700 rounded-xl p-2 mt-1 overflow-x-auto">
                      {JSON.stringify(b.transactions, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
