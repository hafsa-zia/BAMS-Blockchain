// frontend/pages/admin/departments/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../utils/api";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error loading departments:", err);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      await createDepartment({ name });
      setName("");
      fetchDepartments();
    } catch (err) {
      console.error("Error creating department:", err);
      alert("Failed to create department");
    }
  };

  const startEdit = (dept) => {
    setEditingId(dept._id);
    setEditName(dept.name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateDepartment(id, { updates: { name: editName } });
      setEditingId(null);
      setEditName("");
      fetchDepartments();
    } catch (err) {
      console.error("Error updating department:", err);
      alert("Failed to update department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Mark this department as deleted?")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
      alert("Failed to delete department");
    }
  };

  return (
    <div className="page-bg">
      <div className="page-container">
        <h1 className="page-title">Departments (Admin)</h1>
        <p className="page-subtitle">
          Layer 1 blockchain. Each department maintains its own immutable chain.
        </p>

        {/* Create department */}
        <div className="card p-4 mb-6 flex gap-3 items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Department Name (e.g. School of Computing)"
            className="input flex-1"
          />
          <button onClick={handleAdd} className="btn-primary">
            Add Department
          </button>
        </div>

        {/* List departments */}
        {departments.length === 0 ? (
          <p className="muted">No departments yet. Start by adding one above.</p>
        ) : (
          <div className="space-y-4">
            {departments.map((d) => (
              <div key={d._id} className="list-card">
                <div className="flex-1">
                  {editingId === d._id ? (
                    <>
                      <input
                        className="input mb-2"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <div className="muted">
                        Editing latest department metadata (old blocks remain in
                        chain).
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-slate-100">
                        {d.name}
                      </div>
                      <div className="muted">
                        Blocks in chain: {d.chain?.length || 0}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {editingId === d._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(d._id)}
                        className="btn-primary px-3 py-1.5 text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/admin/departments/${d._id}`}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => startEdit(d)}
                        className="btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
