export default function ClassCard({ cls }) {
  return (
    <div className="border p-3 rounded">
      <div className="font-semibold">{cls.name}</div>
      <div className="text-xs text-gray-600">Blocks: {cls.chain?.length || 0}</div>
    </div>
  );
}
