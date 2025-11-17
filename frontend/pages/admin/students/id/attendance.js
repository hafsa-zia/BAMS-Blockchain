import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getStudentChain, markAttendance } from "../../../../utils/api";

export default function AttendancePage() {
  const router = useRouter();
  const { id } = router.query;

  const [chain, setChain] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const res = await getStudentChain(id);
      setChain(res.data.chain);
    }
    load();
  }, [id]);

  async function handleMarkPresent() {
    await markAttendance(id, { status: "Present" });
    const res = await getStudentChain(id);
    setChain(res.data.chain);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance History</h1>

      <button
        onClick={handleMarkPresent}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Mark Present
      </button>

      {chain.length === 0 ? (
        <p className="text-gray-600">No attendance yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Hash</th>
            </tr>
          </thead>
          <tbody>
            {chain.map((b, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">
                  {new Date(b.timestamp).toLocaleString()}
                </td>
                <td className="border px-3 py-2">
                  {b.transactions[0]?.status}
                </td>
                <td className="border px-3 py-2">{b.hash.slice(0, 20)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
