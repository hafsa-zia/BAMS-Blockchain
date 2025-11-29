import { useEffect, useState } from "react";
import Link from "next/link";
import { getValidationReport } from "../../utils/api";

export default function ValidationPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getValidationReport();
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching validation report:", err);
        setError("Failed to load validation report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Blockchain Validation Dashboard
          </h1>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-gray-600">Validating chains...</div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {report && (
          <>
            {/* Overall status */}
            <div className="mb-6 p-4 rounded-lg shadow bg-white flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-wide text-gray-500">
                  Overall Chain Status
                </div>
                <div
                  className={`mt-1 text-xl font-bold ${
                    report.overallValid
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {report.overallValid ? "All Chains Valid" : "Some Chains Invalid"}
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  report.overallValid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {report.overallValid ? "✔ Secure" : "⚠ Attention Required"}
              </div>
            </div>

            {/* Departments */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Department Chains
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2">Name</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.departments.map((d) => (
                      <tr
                        key={d.id}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-2">{d.name}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.valid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {d.valid ? "Valid" : "Invalid"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {d.errors.length === 0 ? (
                            <span className="text-emerald-600">
                              No issues detected
                            </span>
                          ) : (
                            <ul className="list-disc pl-4 space-y-1">
                              {d.errors.map((e, idx) => (
                                <li key={idx}>{e}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                    {report.departments.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-gray-500"
                        >
                          No departments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Classes */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Class Chains
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2">Name</th>
                      <th className="text-left px-4 py-2">Department ID</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.classes.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-2">{c.name}</td>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {c.departmentId}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.valid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {c.valid ? "Valid" : "Invalid"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {c.errors.length === 0 ? (
                            <span className="text-emerald-600">
                              No issues detected
                            </span>
                          ) : (
                            <ul className="list-disc pl-4 space-y-1">
                              {c.errors.map((e, idx) => (
                                <li key={idx}>{e}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                    {report.classes.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-gray-500"
                        >
                          No classes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Students */}
            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Student Chains & Attendance Blocks
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2">Name</th>
                      <th className="text-left px-4 py-2">Roll</th>
                      <th className="text-left px-4 py-2">Class ID</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.students.map((s) => (
                      <tr
                        key={s.id}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-2">{s.name}</td>
                        <td className="px-4 py-2 text-xs text-gray-700">
                          {s.rollNumber}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500">
                          {s.classId}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              s.valid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {s.valid ? "Valid" : "Invalid"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {s.errors.length === 0 ? (
                            <span className="text-emerald-600">
                              No issues detected
                            </span>
                          ) : (
                            <ul className="list-disc pl-4 space-y-1">
                              {s.errors.map((e, idx) => (
                                <li key={idx}>{e}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                    {report.students.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-gray-500"
                        >
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
