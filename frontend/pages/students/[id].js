import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getStudent, getStudentChain, markAttendance, updateStudent, deleteStudent } from "../../../utils/api";
import { useAuth } from "../../../utils/auth";

export default function StudentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStudentSelf = user?.role === "student" && user.id === id;

  const [student, setStudent] = useState(null);
  const [chain, setChain] = useState([]);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (id) fetchStudent(); }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await getStudent(id);
      setStudent(res.data);
      const chainRes = await getStudentChain(id);
      setChain(chainRes.data.chain || []);
    } catch (err) { console.error(err); }
  };

  const handleMark = async () => {
    if (!isAdmin) return alert("Only admins can mark attendance.");
    setLoading(true);
    try {
      await markAttendance(id, { status });
      await fetchStudent();
    } catch (err) { console.error(err); alert("Mark failed"); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!isAdmin) return;
    const newName = prompt("New name", student.name);
    if (newName == null) return;
    try {
      await updateStudent(id, { updates: { name: newName }});
      await fetchStudent();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!confirm("Mark this student deleted?")) return;
    try {
      await deleteStudent(id);
      router.push("/students");
    } catch (err) { console.error(err); }
  };

  if (!student) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Student</h2>
      <div className="border p-4 rounded mb-4">
        <div className="text-xl font-semibold">{student.name}</div>
        <div className="text-xs text-gray-600">Roll: {student.rollNumber}</div>
        <div className="text-xs text-gray-600">Blocks: {chain.length}</div>
      </div>

      {/* Admin-only mark UI */}
      {isAdmin && (
        <div className="mb-4">
          <h3 className="text-lg">Mark Attendance</h3>
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="border p-2 mr-2">
            <option>Present</option>
            <option>Absent</option>
            <option>Leave</option>
          </select>
          <button onClick={handleMark} className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading}>
            {loading ? "Marking..." : "Mark"}
          </button>
        </div>
      )}

      {/* Student self cannot mark others; show message */}
      {user?.role === "student" && !isStudentSelf && (
        <div className="mb-4 text-sm text-gray-500">You can only view your own profile/attendance.</div>
      )}

      {/* Edit/delete controls */}
      {isAdmin && (
        <div className="mb-4 flex gap-2">
          <button onClick={handleEdit} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit</button>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      )}

      <div>
        <h3 className="text-lg mb-2">Blockchain (chronological)</h3>
        <div className="space-y-2">
          {chain.map((b, idx) => (
            <div key={idx} className="border p-3 rounded">
              <div className="text-sm text-gray-600">Index: {b.index} — Timestamp: {new Date(b.timestamp).toLocaleString()}</div>
              <div className="text-xs mt-1"><strong>Prev Hash:</strong> <div className="truncate">{b.prevHash}</div></div>
              <div className="text-xs mt-1"><strong>Hash:</strong> <div className="truncate">{b.hash}</div></div>
              <div className="text-xs mt-1"><strong>Nonce:</strong> {b.nonce}</div>
              <div className="mt-2"><strong>Txn:</strong> <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(b.transactions, null, 2)}</pre></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
