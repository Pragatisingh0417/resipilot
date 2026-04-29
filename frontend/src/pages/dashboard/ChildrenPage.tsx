import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { Plus, Search, Trash2, Loader2, X } from 'lucide-react';

interface Child {
  _id: string; firstName: string; lastName: string; dateOfBirth?: string;
  gender?: string; status: string; riskLevel: string; medicalInfo?: string;
  educationInfo?: string; notes?: string; assignedWorker?: any;
}

const emptyForm = { firstName: '', lastName: '', dateOfBirth: '', gender: '', status: 'active', riskLevel: 'low', medicalInfo: '', educationInfo: '', notes: '' };
const riskColors: Record<string, string> = { low: 'bg-green-50 text-green-700', medium: 'bg-yellow-50 text-yellow-700', high: 'bg-red-50 text-red-700', critical: 'bg-purple-50 text-purple-700' };
const statusColors: Record<string, string> = { active: 'bg-green-50 text-green-700', placed: 'bg-blue-50 text-blue-700', reunified: 'bg-gray-50 text-gray-700', aged_out: 'bg-gray-50 text-gray-700' };

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Child | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const loadChildren = async () => {
    try {
     const res = await api.get('/children');
setChildren(res.data || []);

    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadChildren(); }, []);

  const filtered = children.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (child: Child) => {
    setEditing(child);
    setForm({
      firstName: child.firstName, lastName: child.lastName,
      dateOfBirth: child.dateOfBirth?.split('T')[0] || '', gender: child.gender || '',
      status: child.status, riskLevel: child.riskLevel,
      medicalInfo: child.medicalInfo || '', educationInfo: child.educationInfo || '',
      notes: child.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName) return alert('First and last name required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/children/${editing._id}`, form);
      } else {
        await api.post('/children', form);
      }
      setDialogOpen(false);
      loadChildren();
    } catch (err: any) { alert(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try { await api.del(`/children/${id}`); loadChildren(); } catch {}
  };

  return (
    <div>
      <Header title="Children" description="Manage children profiles" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" placeholder="Search children..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Child
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                  <th className="px-6 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(child => {
                  const age = child.dateOfBirth ? Math.floor((Date.now() - new Date(child.dateOfBirth).getTime()) / 31557600000) : '-';
                  return (
                    <tr key={child._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(child)}>
                      <td className="px-6 py-4 text-sm font-medium">{child.firstName} {child.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{age}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{child.gender || '-'}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[child.status]}`}>{child.status}</span></td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColors[child.riskLevel]}`}>{child.riskLevel}</span></td>
                      <td className="px-6 py-4">
                        <button onClick={e => { e.stopPropagation(); handleDelete(child._id); }} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-8">No children found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Child' : 'Add New Child'}</h2>
              <button onClick={() => setDialogOpen(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input className="w-full px-3 py-2 border rounded-lg" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input className="w-full px-3 py-2 border rounded-lg" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" className="w-full px-3 py-2 border rounded-lg" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select className="w-full px-3 py-2 border rounded-lg" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select className="w-full px-3 py-2 border rounded-lg" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="active">Active</option><option value="placed">Placed</option><option value="reunified">Reunified</option><option value="aged_out">Aged Out</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label><select className="w-full px-3 py-2 border rounded-lg" value={form.riskLevel} onChange={e => setForm({...form, riskLevel: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Medical Info</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={form.medicalInfo} onChange={e => setForm({...form, medicalInfo: e.target.value})} /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Education Info</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={form.educationInfo} onChange={e => setForm({...form, educationInfo: e.target.value})} /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDialogOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add'} Child
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
