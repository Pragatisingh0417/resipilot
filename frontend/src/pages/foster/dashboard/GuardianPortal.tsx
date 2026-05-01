import { useState } from "react";

export default function GuardianPortalPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    status: "Active",
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Guardian Portal</h1>

      <div className="bg-card p-4 rounded-xl border border-border space-y-3">
        
        <input
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded"
          value={form.relationship}
          onChange={(e) => setForm({ ...form, relationship: e.target.value })}
        >
          <option value="">Select Relationship</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="relative">Relative</option>
          <option value="foster">Foster Guardian</option>
        </select>

        <button className="bg-primary text-white px-4 py-2 rounded">
          Save Guardian
        </button>
      </div>
    </div>
  );
}