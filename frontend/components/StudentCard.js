export default function StudentCard({ student }) {
  return (
    <div className="border p-3 rounded">
      <div className="font-semibold">{student.name}</div>
      <div className="text-xs text-gray-600">Roll: {student.rollNumber}</div>
    </div>
  );
}
