import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent, getClasses } from "../../../utils/api";
import { useAuth } from "../../../utils/auth";

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", rollNumber: "", departmentId: "", classId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [sres, cres] = await Promise.all([getStudents(), getClasses()]);
      setStudents(sres.data || []);
      setClasses(cres.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate() {
    if (!form.name || !form.rollNumber || !form.classId || !form.departmentId) return alert("Fill required fields");
    try {
      await createStudent(form);
      setForm({ name: "", rollNumber: "", departmentId: "", classId: "" });
      fetchData();
    } catch (err) { console.error(err); alert("Create failed"); }
  }

  async function handleEdit(student) {
    const newName = prompt("New name", student.name);
    if (newName == null) return;
    try {
      await updateStudent(student._id, { updates: { name: newName }});
      fetchData();
    } catch (err) { console.error(err); }
  }

  async function handleDelete(student) {
    if (!confirm("Mark this student deleted? (This app appends a delete block)")) return;
    try {
      await deleteStudent(student._id);
      fetchData();
    } catch (err) { console.error(err); }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="text-sm text-gray-600">Logged as: {user?.role || "Guest"} {user?.name ? `(${user.name})` : ""}</div>
      </div>

      {isAdmin && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">Create Student</h3>
          <div className="grid md:grid-cols-4 gap-2">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-2" />
            <input placeholder="Roll Number" value={form.rollNumber} onChange={e=>setForm({...form,rollNumber:e.target.value})} className="border p-2" />
            <select value={form.departmentId} onChange={e=>setForm({...form,departmentId:e.target.value})} className="border p-2">
              <option value="">Select Dept</option>
              {/* you might fetch and populate departments similarly */}
            </select>
            <select value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} className="border p-2">
              <option value="">Select Class</option>
              {classes.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="mt-3">
            <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Create Student</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {students.map(s => (
          <div key={s._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-500">Roll: {s.rollNumber}</div>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/students/${s._id}`} className="text-blue-600">Open</Link>
              {isAdmin && (
                <>
                  <button onClick={()=>handleEdit(s)} className="text-sm text-indigo-600">Edit</button>
                  <button onClick={()=>handleDelete(s)} className="text-sm text-red-600">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
