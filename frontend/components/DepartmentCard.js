export default function DepartmentCard({ dept }) {
  return (
    <div className="border p-3 rounded">
      <div className="font-semibold">{dept.name}</div>
      <div className="text-xs text-gray-600">Blocks: {dept.chain?.length || 0}</div>
    </div>
  );
}
