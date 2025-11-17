import { useState, useEffect } from "react";
import { getDepartments, createDepartment } from "../../../utils/api";
import Link from "next/link";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async () => {
    if (!name) return;
    await createDepartment({ name });
    setName("");
    fetchDepartments();
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      <div className="mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department Name"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
      <div>
        {departments.map((d) => (
          <div key={d._id} className="border p-3 mb-2 rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{d.name}</div>
                <div className="text-xs text-gray-600">
                  Blocks: {d.chain?.length || 0}
                </div>
              </div>
              <div>
                <Link href={`/departments/${d._id}`} className="text-blue-500">
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="text-gray-500">No departments yet.</div>
        )}
      </div>
    </div>
  );
}
