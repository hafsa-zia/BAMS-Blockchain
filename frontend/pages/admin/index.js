export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="space-y-4">
        <a className="block p-4 bg-white rounded shadow" href="/admin/departments">Manage Departments →</a>
        <a className="block p-4 bg-white rounded shadow" href="/admin/classes">Manage Classes →</a>
        <a className="block p-4 bg-white rounded shadow" href="/admin/students">Manage Students →</a>
      </div>
    </div>
  );
}
