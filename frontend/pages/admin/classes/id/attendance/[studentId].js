import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getStudentAttendance } from "../../../../../utils/api";

export default function StudentAttendance() {
  const router = useRouter();
  const { id, studentId } = router.query;

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (id && studentId) loadStudent();
  }, [id, studentId]);

  const loadStudent = async () => {
    try {
      const res = await getStudentAttendance(id, studentId);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📅 Attendance Details</h1>

      <div className="space-y-4 max-w-2xl">
        {attendance.map((a, i) => (
          <div
            key={i}
            className="p-5 bg-white shadow rounded-xl border hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-700">Date: {a.date}</p>
            <p className="text-gray-500">Status: {a.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
