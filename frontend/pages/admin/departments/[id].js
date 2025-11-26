// frontend/pages/admin/departments/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDepartments, getClasses, createClass } from "../../../utils/api";

export default function AdminDepartmentDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [dept, setDept] = useState(null);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (id) {
      fetchDept();
      fetchClassList();
    }
  }, [id]);

  const fetchDept = async () => {
    try {
      const res = await getDepartments();
      const found = (res.data || []).find((d) => d._id === id);
      setDept(found || null);
    } catch (err) {
      console.error("Error loading department:", err);
    }
  };

  const fetchClassList = async () => {
    try {
      const res = await getClasses();
      const list = (res.data || []).filter((c) => c.departmentId === id);
      setClasses(list);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  const handleAddClass = async () => {
    if (!className.trim()) return;
    try {
      await createClass({ name: className, departmentId: id });
      setClassName("");
      await fetchClassList();
      await fetchDept();
    } catch (err) {
      console.error("Error creating class:", err);
      alert("Failed to create class");
    }
  };

  if (!dept) {
    return (
      <div className="page-bg">
        <div className="page-container">Loading department...</div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="page-container">
        <h2 className="page-title">Department Detail</h2>
        <p className="page-subtitle">
          Manage classes under <span className="font-semibold">{dept.name}</span>.
          Class genesis blocks use the latest hash of this department chain.
        </p>

        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-lg">{dept.name}</div>
              <div className="muted">
                Department Chain Blocks: {dept.chain?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Add Class */}
        <div className="card p-4 mb-6">
          <h3 className="section-title">Add Class</h3>
          <p className="muted mb-2">
            Genesis block for this class will reference the latest department
            block hash.
          </p>
          <div className="flex gap-2">
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Class name (e.g. BSCS-1A)"
              className="input flex-1"
            />
            <button onClick={handleAddClass} className="btn-primary">
              Create Class
            </button>
          </div>
        </div>

        {/* Classes list */}
        <div>
          <h3 className="section-title">Classes in this Department</h3>
          {classes.length === 0 ? (
            <div className="muted">No classes in this department yet.</div>
          ) : (
            <div className="space-y-3">
              {classes.map((c) => (
                <div key={c._id} className="list-card">
                  <div>
                    <div className="font-semibold text-slate-100">
                      {c.name}
                    </div>
                    <div className="muted">
                      Class Chain Blocks: {c.chain?.length || 0}
                    </div>
                  </div>
                  <Link
                    href={`/classes/${c._id}`}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
