// pages/attendance/index.js
import { useEffect, useState } from "react";
import { getDepartments, getClasses, getStudents, markAttendance } from "../../utils/api";
import Link from "next/link";

export default function AttendancePage() {
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate] = useState(new Date().toISOString().slice(0, 10)); // today
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadMeta(); }, []);

  const loadMeta = async () => {
    try {
      const [dres, cres, sres] = await Promise.all([getDepartments(), getClasses(), getStudents()]);
      setDepartments(dres.data || []);
      setClasses(cres.data || []);
      setStudents(sres.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      // filter students in class
      setSelectedStudents(new Set());
    }
  }, [selectedClass]);

  const studentsInClass = students.filter(s => s.classId === selectedClass);

  function toggleStudent(id) {
    const set = new Set(selectedStudents);
    if (set.has(id)) set.delete(id); else set.add(id);
    setSelectedStudents(set);
  }

  const markSelected = async () => {
    if (selectedStudents.size === 0) return alert("Select at least one student");
    setLoading(true);
    const ids = Array.from(selectedStudents);
    try {
      // mark attendance for each student (sequential to show progress). Could be batched but spec required block per student.
      for (const sid of ids) {
        await markAttendance({ studentId: sid, status });
      }
      alert("Attendance marked for selected students.");
      setSelectedStudents(new Set());
    } catch (err) {
      console.error(err);
      alert("Error marking attendance. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Attendance — Mark</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select className="border p-2" value={selectedDept} onChange={e=>setSelectedDept(e.target.value)}>
          <option value="">— Select Department —</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>

        <select className="border p-2" value={selectedClass} onChange={e=>setSelectedClass(e.target.value)}>
          <option value="">— Select Class —</option>
          {classes.filter(c => !selectedDept || c.departmentId === selectedDept).map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select className="border p-2" value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Present</option>
          <option>Absent</option>
          <option>Leave</option>
        </select>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">Date: <strong>{selectedDate}</strong></div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Class Roster</h2>
        {selectedClass ? (
          studentsInClass.length === 0 ? (
            <div className="text-gray-500">No students found in this class.</div>
          ) : (
            <div className="grid gap-2">
              {studentsInClass.map(s => (
                <label key={s._id} className="flex items-center p-2 bg-white border rounded">
                  <input type="checkbox" checked={selectedStudents.has(s._id)} onChange={()=>toggleStudent(s._id)} className="mr-3" />
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-600">Roll: {s.rollNumber}</div>
                    <div className="text-xs text-gray-400">Blocks: {s.chain?.length || 0}</div>
                  </div>
                  <div className="ml-auto text-sm">
                    <Link href={`/students/${s._id}/attendance`} className="text-blue-600">View</Link>
                  </div>
                </label>
              ))}
            </div>
          )
        ) : <div className="text-gray-500">Choose a class to show roster.</div>}
      </div>

      <div className="flex gap-3">
        <button disabled={loading || selectedStudents.size===0} onClick={markSelected} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {loading ? "Marking..." : `Mark ${status} for selected`}
        </button>

        <Link href="/attendance" className="px-4 py-2 border rounded text-blue-600">Attendance Dashboard</Link>
      </div>
    </div>
  );
}
