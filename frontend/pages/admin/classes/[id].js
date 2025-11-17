import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getClass, createStudent, getStudents } from "../../../utils/api";
import Link from "next/link";

export default function ClassDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [cls, setCls] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    if (id) fetchClass();
    fetchStudents();
  }, [id]);

  const fetchClass = async () => {
    try {
      const res = await getClass(id);
      setCls(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data.filter((s) => s.classId === id));
    } catch (err) { console.error(err); }
  };

  const handleAddStudent = async () => {
    if (!studentName || !rollNumber) return;
    try {
      await createStudent({
        name: studentName,
        rollNumber,
        classId: id,
        departmentId: cls.departmentId,
      });
      setStudentName(""); setRollNumber("");
      fetchStudents();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Class Details</h2>
      {cls ? (
        <div className="border p-4 rounded mb-4">
          <div className="text-xl font-semibold">{cls.name}</div>
          <div className="text-xs text-gray-600">
            Blocks: {cls.chain?.length || 0}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div className="mb-4">
        <h3 className="text-lg">Add Student</h3>
        <div className="flex mt-2">
          <input
            placeholder="Student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="border p-2 mr-2"
          />
          <input
            placeholder="Roll number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleAddStudent}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg mb-2">Students</h3>
        {students.map((s) => (
          <div
            key={s._id}
            className="border p-3 mb-2 rounded flex justify-between"
          >
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-600">Roll: {s.rollNumber}</div>
            </div>
            <div>
              <Link href={`/students/${s._id}`} className="text-blue-600">
                Open
              </Link>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-gray-500">No students yet.</div>
        )}
      </div>
    </div>
  );
}
