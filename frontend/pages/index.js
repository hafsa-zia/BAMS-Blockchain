import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Blockchain Attendance System
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Manage Departments, Classes, Students & Attendance on blockchain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link href="/departments" className="block bg-white shadow hover:shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-semibold text-blue-700">Departments</h2>
            <p className="text-gray-600 mt-2 text-sm">Create and manage departments.</p>
          </Link>

          <Link href="/classes" className="block bg-white shadow hover:shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-semibold text-green-700">Classes</h2>
            <p className="text-gray-600 mt-2 text-sm">View and manage classes.</p>
          </Link>

          <Link href="/students" className="block bg-white shadow hover:shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-semibold text-purple-700">Students</h2>
            <p className="text-gray-600 mt-2 text-sm">View or create students.</p>
          </Link>

        </div>
      </div>
    </main>
  );
}
