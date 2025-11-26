// frontend/pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="page-bg">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="page-title">
            BAMS — Blockchain Attendance Management
          </h1>
          <p className="page-subtitle max-w-2xl">
            Admin panel to manage departments, classes, students, and mark
            attendance. Every change is recorded on a multi-layer blockchain:
            Department → Class → Student → Attendance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/admin/departments" className="card p-5 hover:shadow-2xl transition">
            <div className="pill mb-3">Layer 1</div>
            <h2 className="font-semibold text-lg mb-1">Departments</h2>
            <p className="text-sm text-slate-300 mb-3">
              Create and manage departments. Each department maintains its own
              blockchain.
            </p>
            <span className="text-xs text-indigo-300">Open department manager →</span>
          </Link>

          <Link href="/classes" className="card p-5 hover:shadow-2xl transition">
            <div className="pill mb-3">Layer 2</div>
            <h2 className="font-semibold text-lg mb-1">Classes</h2>
            <p className="text-sm text-slate-300 mb-3">
              Each class extends a department chain and spawns its own secured
              ledger.
            </p>
            <span className="text-xs text-indigo-300">Browse all classes →</span>
          </Link>

          <Link href="/students" className="card p-5 hover:shadow-2xl transition">
            <div className="pill mb-3">Layer 3</div>
            <h2 className="font-semibold text-lg mb-1">Students & Attendance</h2>
            <p className="text-sm text-slate-300 mb-3">
              Inspect student-specific chains and attendance blocks with PoW and
              hashes.
            </p>
            <span className="text-xs text-indigo-300">View students & chains →</span>
          </Link>
        </div>

        
      </div>
    </main>
  );
}
