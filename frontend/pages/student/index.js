// pages/student/index.js
import Link from "next/link";

export default function StudentEntryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Student Portal
        </h1>
        <p className="text-gray-600 mb-4">
          To view student details and attendance (blockchain chain), please go
          to the Students page and select your record.
        </p>

        <Link
          href="/students"
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Students →
        </Link>
      </div>
    </div>
  );
}
