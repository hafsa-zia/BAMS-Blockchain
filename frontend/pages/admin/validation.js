// frontend/pages/admin/validation.js
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Top bar / title section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Blockchain Validation
          </h1>
          <p className="mt-1 text-sm text-gray-300 max-w-xl">
            Verify department, class and student attendance chains across all
            three levels of the hierarchy.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-sm text-gray-100 border border-gray-700 hover:bg-gray-700 transition"
        >
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-10">
        {/* Loading / error */}
        {loading && (
          <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-200">
            Running multi-level validation...
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-900/40 border border-red-500/60 rounded-xl p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {report && (
          <>
            {/* Overall summary card */}
            <section className="mt-6">
              <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-black/40">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                    Overall Chain Status
                  </p>
                  <p
                    className={`mt-2 text-2xl font-semibold ${
                      report.overallValid ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {report.overallValid
                      ? "All Chains Valid & Consistent"
                      : "Integrity Issues Detected"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Validation checks:
                    {" "}
                    hashes, previous links, PoW and parent-child dependencies.
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-xs font-semibold border ${
                    report.overallValid
                      ? "bg-green-900/40 text-green-300 border-green-500/40"
                      : "bg-red-900/40 text-red-300 border-red-500/40"
                  }`}
                >
                  {report.overallValid ? "✔ Secure" : "⚠ Requires Attention"}
                </div>
              </div>
            </section>

            {/* Three columns: Departments, Classes, Students */}
            <section className="mt-8 grid gap-6 md:grid-cols-3">
              {/* Departments card */}
              <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md shadow-black/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wide text-gray-100">
                    Departments
                  </h2>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {report.departments.length} chain(s)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Independent root chains. If a department is tampered, all its
                  child class and student chains are impacted.
                </p>

                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {report.departments.length === 0 && (
                    <p className="text-xs text-gray-500">
                      No departments found.
                    </p>
                  )}

                  {report.departments.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-100">
                          {d.name || "Unnamed Department"}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            d.valid
                              ? "bg-green-900/40 text-green-300 border border-green-500/40"
                              : "bg-red-900/40 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {d.valid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                      {d.errors.length === 0 ? (
                        <p className="mt-1 text-[10px] text-green-300/90">
                          ✓ All department blocks consistent
                        </p>
                      ) : (
                        <ul className="mt-1 text-[10px] text-red-200 list-disc pl-4 space-y-0.5">
                          {d.errors.map((e, idx) => (
                            <li key={idx}>{e}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Classes card */}
              <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md shadow-black/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wide text-gray-100">
                    Classes
                  </h2>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {report.classes.length} chain(s)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Class genesis blocks must reference the latest hash of their
                  parent department chain.
                </p>

                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {report.classes.length === 0 && (
                    <p className="text-xs text-gray-500">
                      No classes found.
                    </p>
                  )}

                  {report.classes.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-100">
                            {c.name || "Unnamed Class"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Dept ID: {c.departmentId}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            c.valid
                              ? "bg-green-900/40 text-green-300 border border-green-500/40"
                              : "bg-red-900/40 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {c.valid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                      {c.errors.length === 0 ? (
                        <p className="mt-1 text-[10px] text-green-300/90">
                          ✓ Genesis prevHash correctly linked to department
                          chain
                        </p>
                      ) : (
                        <ul className="mt-1 text-[10px] text-red-200 list-disc pl-4 space-y-0.5">
                          {c.errors.map((e, idx) => (
                            <li key={idx}>{e}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Students card */}
              <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md shadow-black/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wide text-gray-100">
                    Students & Attendance
                  </h2>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {report.students.length} chain(s)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Student chains contain personal history of attendance; any
                  tampered attendance block breaks the entire chain.
                </p>

                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {report.students.length === 0 && (
                    <p className="text-xs text-gray-500">
                      No students found.
                    </p>
                  )}

                  {report.students.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg border border-gray-800 bg-gray-900/70 px-3 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-100">
                            {s.name || "Unnamed Student"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Roll: {s.rollNumber || "N/A"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Class ID: {s.classId}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            s.valid
                              ? "bg-green-900/40 text-green-300 border border-green-500/40"
                              : "bg-red-900/40 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {s.valid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                      {s.errors.length === 0 ? (
                        <p className="mt-1 text-[10px] text-green-300/90">
                          ✓ All attendance blocks consistent and linked with PoW
                          satisfied
                        </p>
                      ) : (
                        <ul className="mt-1 text-[10px] text-red-200 list-disc pl-4 space-y-0.5">
                          {s.errors.map((e, idx) => (
                            <li key={idx}>{e}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
