import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getDepartments, getClasses, createClass } from "../../../utils/api";
import Link from "next/link";

export default function DepartmentDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [dept, setDept] = useState(null);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (id) fetchDept();
    fetchClassList();
  }, [id]);

  const fetchDept = async () => {
    try {
      const res = await getDepartments();
      const found = res.data.find((d) => d._id === id);
      setDept(found || null);
    } catch (err) { console.error(err); }
  };

  const fetchClassList = async () => {
    try {
      const res = await getClasses();
      const list = res.data.filter((c) => c.departmentId === id);
      setClasses(list);
    } catch (err) { console.error(err); }
  };

  const handleAddClass = async () => {
    if (!className) return;
    try {
      await createClass({ name: className, departmentId: id });
      setClassName("");
      fetchClassList();
      fetchDept();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Department</h2>
      {dept ? (
        <div className="border p-4 rounded mb-4">
          <div className="text-xl font-semibold">{dept.name}</div>
          <div className="text-sm text-gray-600">
            Blocks: {dept.chain?.length || 0}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div className="mb-4">
        <h3 className="text-lg">Classes</h3>
        <div className="flex mt-2">
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class name"
            className="border p-2 mr-2"
          />
          <button
            onClick={handleAddClass}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Create Class
          </button>
        </div>
      </div>

      <div>
        {classes.map((c) => (
          <div
            key={c._id}
            className="border p-3 mb-2 rounded flex justify-between"
          >
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-600">
                Blocks: {c.chain?.length || 0}
              </div>
            </div>
            <div>
              <Link href={`/classes/${c._id}`} className="text-blue-600">
                Open
              </Link>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="text-gray-500">No classes in this department yet.</div>
        )}
      </div>
    </div>
  );
}
