export default function AddEditForm({ fields = [], onSubmit, submitLabel = "Save" }) {
  // fields: [{ name, value, onChange, placeholder }]
  return (
    <div>
      <div className="flex space-x-2">
        {fields.map(f => (
          <input key={f.name} value={f.value} onChange={f.onChange} placeholder={f.placeholder} className="border p-2" />
        ))}
        <button onClick={onSubmit} className="bg-blue-600 text-white px-3 py-1 rounded">{submitLabel}</button>
      </div>
    </div>
  );
}
