export default function AttendanceTable({ records = [] }) {
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Time</th>
          <th className="p-2">Student</th>
          <th className="p-2">Roll</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
            <td className="p-2">{r.transactions?.name || r.name}</td>
            <td className="p-2">{r.transactions?.rollNumber || r.rollNumber}</td>
            <td className="p-2">{r.transactions?.status || r.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
