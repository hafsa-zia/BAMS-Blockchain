import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getClassById, updateClass, deleteClass } from "../../../../utils/api";
import { useAuth } from "../../../../utils/auth";
import Link from "next/link";

export default function ClassDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [classData, setClassData] = useState(null);

  useEffect(()=>{ if(id) load(); }, [id]);

  async function load(){
    try{ const res = await getClassById(id); setClassData(res.data); } catch(e){ console.error(e); }
  }

  async function edit(){
    const newName = prompt("New class name", classData.name);
    if(newName == null) return;
    try{ await updateClass(id, { updates: { name: newName } }); load(); } catch(e){console.error(e);}
  }

  async function remove(){
    if(!confirm("Mark this class deleted?")) return;
    try{ await deleteClass(id); router.push("/classes"); } catch(e){console.error(e);}
  }

  if(!classData) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{classData.name}</h1>
      <div className="text-sm text-gray-600 mb-4">Dept: {classData.departmentId}</div>

      <div className="flex gap-3 mb-6">
        <Link href={`/classes/${id}/attendance`} className="px-4 py-2 bg-blue-600 text-white rounded">View Attendance</Link>
        {isAdmin && <>
          <button onClick={edit} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit</button>
          <button onClick={remove} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </>}
      </div>
    </div>
  );
}
