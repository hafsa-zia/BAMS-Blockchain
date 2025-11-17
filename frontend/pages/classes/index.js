import { useEffect, useState } from "react";
import { getClasses, createClass, updateClass, deleteClass } from "../../../utils/api";
import { useAuth } from "../../../utils/auth";
import Link from "next/link";

export default function ClassesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [deptId, setDeptId] = useState("");

  useEffect(()=>{ fetchClasses(); }, []);

  async function fetchClasses(){ try { const res = await getClasses(); setClasses(res.data || []); } catch(e){console.error(e);} }

  async function handleCreate(){
    if(!name || !deptId) return alert("Enter name and dept id");
    try{ await createClass({ name, departmentId: deptId }); setName(""); setDeptId(""); fetchClasses(); } catch(e){console.error(e);}
  }

  async function handleEdit(c){
    const newName = prompt("New class name", c.name);
    if(newName == null) return;
    try{ await updateClass(c._id, { updates: { name: newName } }); fetchClasses(); } catch(e){console.error(e);}
  }

  async function handleDelete(c){
    if(!confirm("Mark this class deleted?")) return;
    try{ await deleteClass(c._id); fetchClasses(); } catch(e){console.error(e);}
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Classes</h1>
        <div className="text-sm text-gray-600">Logged as: {user?.role || "Guest"}</div>
      </div>

      {isAdmin && (
        <div className="bg-white p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Create Class</h3>
          <div className="flex gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Class name" className="border p-2" />
            <input value={deptId} onChange={e=>setDeptId(e.target.value)} placeholder="Department id" className="border p-2" />
            <button onClick={handleCreate} className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {classes.map(c=>(
          <div key={c._id} className="p-4 bg-white rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">Dept: {c.departmentId}</div>
            </div>
            <div className="flex gap-3 items-center">
              <Link href={`/classes/${c._id}`} className="text-blue-600">Open</Link>
              {isAdmin && <>
                <button onClick={()=>handleEdit(c)} className="text-indigo-600">Edit</button>
                <button onClick={()=>handleDelete(c)} className="text-red-600">Delete</button>
              </>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
