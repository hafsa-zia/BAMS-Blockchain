// frontend/pages/classes/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { getClasses, updateClass, deleteClass } from "../../utils/api";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchClassList();
  }, []);

  const fetchClassList = async () => {
    try {
      const res = await getClasses();
      setClasses(res.data || []);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  const startEdit = (cls) => {
    setEditingId(cls._id);
    setEditName(cls.name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateClass(id, { updates: { name: editName } });
      setEditingId(null);
      setEditName("");
      fetchClassList();
    } catch (err) {
      console.error("Error updating class:", err);
      alert("Failed to update class");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Mark this class as deleted?")) return;
    try {
      await deleteClass(id);
      fetchClassList();
    } catch (err) {
      console.error("Error deleting class:", err);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="page-bg">
      <div className="page-container">
        <h1 className="page-title">Classes</h1>
        <p className="page-subtitle">
          Each class is a child blockchain whose genesis references its parent
          department chain.
        </p>

        {classes.length === 0 ? (
          <p className="muted">
            No classes available. Create them under a specific department.
          </p>
        ) : (
          <div className="space-y-4">
            {classes.map((c) => (
              <div key={c._id} className="list-card">
                <div className="flex-1">
                  {editingId === c._id ? (
                    <>
                      <input
                        className="input mb-2"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <div className="muted">
                        Editing latest class metadata (history lives in chain).
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-slate-100">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Dept ID: {c.departmentId}
                      </div>
                      <div className="muted">
                        Blocks: {c.chain?.length || 0}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {editingId === c._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(c._id)}
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
                        href={`/classes/${c._id}`}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => startEdit(c)}
                        className="btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
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
