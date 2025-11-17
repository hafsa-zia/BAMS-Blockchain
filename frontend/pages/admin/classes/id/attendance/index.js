import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAttendanceByClass } from "../../../../../utils/api";

export default function AttendanceList() {
  const router = useRouter();
  const { id } = router.query;

  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (id) loadAttendance();
  }, [id]);

  const loadAttendance = async () => {
    try {
      const res = await getAttendanceByClass(id);
      setRecords(res.data);
    } catch (err) {
      console.error("Error loading attendance:", err);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">📝 Attendance</h1>

      <div className="space-y-4">
        {records.map((s) => (
          <div
            key={s.studentId}
            className="p-5 bg-white rounded-xl shadow hover:shadow-lg border transition flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg">{s.studentName}</h2>
              <p className="text-gray-500 text-sm">Roll No: {s.rollNumber}</p>
            </div>

            <a
              href={`/classes/${id}/attendance/${s.studentId}`}
              className="text-blue-600 hover:underline"
            >
              View →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
