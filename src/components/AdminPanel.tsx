import { apiFetch } from '../mockApi';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PaperProfile, 
  PlateProfile,
  LaminationRate, 
  MiscCost, 
  PrintingBracketsConfig, 
  User 
} from '../types';
import { 
  Database, 
  Layers, 
  Wrench, 
  TrendingUp, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  CheckCircle, 
  X, 
  AlertCircle, 
  FileSpreadsheet, 
  ShieldCheck 
} from 'lucide-react';

interface AdminPanelProps {
  papers: PaperProfile[];
  laminations: LaminationRate[];
  plateProfiles: PlateProfile[];
  miscCosts: MiscCost[];
  brackets: PrintingBracketsConfig;
  token: string;
  onRefreshData: () => void;
}

type AdminTab = 'papers' | 'lamination' | 'plates' | 'misc' | 'brackets' | 'users';

export default function AdminPanel({ 
  papers, 
  laminations, 
  plateProfiles,
  miscCosts, 
  brackets, 
  token, 
  onRefreshData 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('papers');
  
  // Status feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing / Form states
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [paperForm, setPaperForm] = useState({
    name: '',
    size: 'Full Sheet (23x36)',
    gsm: 130,
    paperType: 'Art Matte',
    pricePerFullSheet: 6.5
  });

  const [editingLamId, setEditingLamId] = useState<string | null>(null);
  const [lamForm, setLamForm] = useState({
    name: '',
    ratePerSqInch: 0.15
  });

  const [editingPlateId, setEditingPlateId] = useState<string | null>(null);
  const [plateForm, setPlateForm] = useState({
    name: '',
    cost: 400
  });

  const [editingMiscId, setEditingMiscId] = useState<string | null>(null);
  const [miscForm, setMiscForm] = useState({
    name: '',
    type: 'fixed' as 'fixed' | 'per_unit',
    cost: 1000
  });

  // Printing Brackets configuration form state
  const [bracketsForm, setBracketsForm] = useState<PrintingBracketsConfig>(() => {
    const b = JSON.parse(JSON.stringify(brackets));
    if (!b.singleColor) b.singleColor = { bracket1: { maxImpressions: 1100, cost: 300 }, excessStepImpressions: 1000, excessStepCost: 100 };
    if (!b.singleColorDoubleDummy) b.singleColorDoubleDummy = { bracket1: { maxImpressions: 1100, cost: 400 }, excessStepImpressions: 1000, excessStepCost: 150 };
    return b;
  });
  const [bracketTab, setBracketTab] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');
  
  const currentBracketFields = bracketTab === 'single_color' ? bracketsForm.singleColor : bracketTab === 'single_color_double_dummy' ? bracketsForm.singleColorDoubleDummy : bracketsForm;
                               
  const updateBracketField = (field, subfield, value) => {
    setBracketsForm(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      
      if (bracketTab === 'multi_color') {
        if (subfield) next[field][subfield] = value;
        else next[field] = value;
      } else if (bracketTab === 'single_color') {
        if (!next.singleColor) {
          next.singleColor = JSON.parse(JSON.stringify({
            bracket1: { maxImpressions: 1100, cost: 300 },
            excessStepImpressions: 1000,
            excessStepCost: 100
          }));
        }
        if (subfield) next.singleColor[field][subfield] = value;
        else next.singleColor[field] = value;
      } else {
        if (!next.singleColorDoubleDummy) {
          next.singleColorDoubleDummy = JSON.parse(JSON.stringify({
            bracket1: { maxImpressions: 1100, cost: 400 },
            excessStepImpressions: 1000,
            excessStepCost: 150
          }));
        }
        if (subfield) next.singleColorDoubleDummy[field][subfield] = value;
        else next.singleColorDoubleDummy[field] = value;
      }
      return next;
    });
  };

  // Users management states
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'employee' as 'admin' | 'employee',
    password: ''
  });

  // Fetch users when user management tab is selected
  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
    // Sync brackets from props when tab or props change
    const b = JSON.parse(JSON.stringify(brackets));
    if (!b.singleColor) b.singleColor = { bracket1: { maxImpressions: 1100, cost: 300 }, excessStepImpressions: 1000, excessStepCost: 100 };
    if (!b.singleColorDoubleDummy) b.singleColorDoubleDummy = { bracket1: { maxImpressions: 1100, cost: 400 }, excessStepImpressions: 1000, excessStepCost: 150 };
    setBracketsForm(b);
  }, [activeTab, brackets]);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSystemUsers(data);
      }
    } catch (err) {
      console.error('Error fetching system users:', err);
    }
  };

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 4000);
  };

  // 1. PAPER PROFILE CONTROLLERS
  const handleSavePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = editingPaperId 
        ? { id: editingPaperId, ...paperForm }
        : paperForm;

      const res = await apiFetch('/api/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save paper profile.');
      
      showNotification(editingPaperId ? 'Paper profile updated!' : 'Paper profile added!');
      setEditingPaperId(null);
      setPaperForm({ name: '', size: 'Full Sheet (23x36)', gsm: 130, paperType: 'Art Matte', pricePerFullSheet: 6.5 });
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (id: string) => {
    if (!confirm('Are you sure you want to remove this paper profile?')) return;
    try {
      const res = await apiFetch(`/api/papers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete paper profile.');
      showNotification('Paper profile deleted successfully.');
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  const startEditPaper = (paper: PaperProfile) => {
    setEditingPaperId(paper.id);
    setPaperForm({
      name: paper.name,
      size: paper.size,
      gsm: paper.gsm,
      paperType: paper.paperType,
      pricePerFullSheet: paper.pricePerFullSheet
    });
  };

  // 2. LAMINATION RATE CONTROLLERS
  const handleSaveLam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lamForm.name) return;
    setLoading(true);
    try {
      const payload = editingLamId 
        ? { id: editingLamId, ...lamForm }
        : lamForm;

      const res = await apiFetch('/api/lamination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save lamination.');
      showNotification(editingLamId ? 'Lamination rate updated!' : 'Lamination rate setting saved.');
      setEditingLamId(null);
      setLamForm({ name: '', ratePerSqInch: 0.15 });
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const startEditLam = (lam: LaminationRate) => {
    setEditingLamId(lam.id);
    setLamForm({
      name: lam.name,
      ratePerSqInch: lam.ratePerSqInch
    });
  };

  const handleDeleteLam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lamination setting?')) return;
    try {
      const res = await apiFetch(`/api/lamination/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete lamination.');
      showNotification('Lamination rate deleted.');
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  // 2b. PLATE PROFILE CONTROLLERS
  const handleSavePlate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateForm.name) return;
    setLoading(true);
    try {
      const payload = editingPlateId 
        ? { id: editingPlateId, ...plateForm }
        : plateForm;

      const res = await apiFetch('/api/plate-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save plate profile.');
      showNotification(editingPlateId ? 'Plate profile updated!' : 'Plate profile added!');
      setEditingPlateId(null);
      setPlateForm({ name: '', cost: 400 });
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plate profile?')) return;
    try {
      const res = await apiFetch(`/api/plate-profiles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete plate profile.');
      showNotification('Plate profile deleted.');
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  const startEditPlate = (plate: PlateProfile) => {
    setEditingPlateId(plate.id);
    setPlateForm({
      name: plate.name,
      cost: plate.cost
    });
  };

  // 3. MISC/POST-PRESS COST CONTROLLERS
  const handleSaveMisc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!miscForm.name) return;
    setLoading(true);
    try {
      const payload = editingMiscId 
        ? { id: editingMiscId, ...miscForm }
        : miscForm;

      const res = await apiFetch('/api/misc-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save cost preset.');
      showNotification(editingMiscId ? 'Miscellaneous cost preset updated!' : 'Miscellaneous cost preset added/updated.');
      setEditingMiscId(null);
      setMiscForm({ name: '', type: 'fixed', cost: 1000 });
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const startEditMisc = (misc: MiscCost) => {
    setEditingMiscId(misc.id);
    setMiscForm({
      name: misc.name,
      type: misc.type,
      cost: misc.cost
    });
  };

  const handleDeleteMisc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cost setting?')) return;
    try {
      const res = await apiFetch(`/api/misc-costs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete setting.');
      showNotification('Cost setting removed.');
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  // 4. PRINTING COST BRACKET CONTROLLER
  const handleSaveBracketsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(bracketsForm));
      if (payload.singleColor) {
        delete payload.singleColor.bracket2;
        delete payload.singleColor.bracket3;
      }
      if (payload.singleColorDoubleDummy) {
        delete payload.singleColorDoubleDummy.bracket2;
        delete payload.singleColorDoubleDummy.bracket3;
      }
      const res = await apiFetch('/api/brackets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save brackets configuration.');
      showNotification('Printing cost bracket tiers synchronized successfully!');
      onRefreshData();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // 5. USER ACCOUNTS CONTROLLERS
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.password) return;
    setLoading(true);
    try {
      const res = await apiFetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to provision user.');
      
      showNotification(`Employee ${userForm.name} provisioned successfully!`);
      setUserForm({ name: '', email: '', role: 'employee', password: '' });
      fetchUsers();
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Permanently delete this user account?')) return;
    try {
      const res = await apiFetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user.');
      
      showNotification('User deleted.');
      fetchUsers();
    } catch (err: any) {
      showNotification(err.message, true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Top Banner decoration */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Pricing & Administration Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global administrative controls to modify base paper costs, printing bracket tiers, laminations, folding, and team logins.
          </p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-indigo-300 font-bold">Admin Database Sync</span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50/50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('papers')}
          className={`py-4 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'papers' 
              ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-800 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Paper Profiles
        </button>
        <button
          onClick={() => setActiveTab('lamination')}
          className={`py-4 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'lamination' 
              ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-800 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Lamination Rates
        </button>
        <button
          onClick={() => setActiveTab('plates')}
          className={`py-4 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'plates' 
              ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-800 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          Plate Profiles
        </button>
        <button
          onClick={() => setActiveTab('misc')}
          className={`py-4 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'misc' 
              ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-800 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Post-Press / Misc
        </button>
        <button
          onClick={() => setActiveTab('brackets')}
          className={`py-4 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'brackets' 
              ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-800 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Printing Brackets
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-4 px-6 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'users' 
              ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-800 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
      </div>

      {/* Notifications feedback popup */}
      {(success || error) && (
        <div className="mx-6 sm:mx-8 mt-6">
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            error ? 'bg-rose-50 border border-rose-100 text-rose-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'
          }`}>
            {error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
            <span className="font-medium">{error || success}</span>
          </div>
        </div>
      )}

      {/* Tab Panels content */}
      <div className="p-6 sm:p-8">
        
        {/* PANEL 1: PAPERS MANAGEMENT */}
        {activeTab === 'papers' && (
          <div className="space-y-8">
            <form onSubmit={handleSavePaper} className="bg-slate-50 dark:bg-slate-800/50 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingPaperId ? 'Edit Paper Profile' : 'Add New Paper Profile'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Paper Grade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Art Matte 130 GSM"
                    value={paperForm.name}
                    onChange={(e) => setPaperForm({ ...paperForm, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Sheet Dimension Size</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Sheet (23x36)"
                    value={paperForm.size}
                    onChange={(e) => setPaperForm({ ...paperForm, size: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">GSM Weight (gsm)</label>
                  <input
                    type="number"
                    required
                    value={paperForm.gsm}
                    onChange={(e) => setPaperForm({ ...paperForm, gsm: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Paper Type / Family</label>
                  <input
                    type="text"
                    required
                    placeholder="Art Matte"
                    value={paperForm.paperType}
                    onChange={(e) => setPaperForm({ ...paperForm, paperType: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Price per Full Sheet (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paperForm.pricePerFullSheet}
                    onChange={(e) => setPaperForm({ ...paperForm, pricePerFullSheet: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200 font-bold font-mono"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingPaperId ? 'Save Changes' : 'Create Profile'}
                  </button>
                  {editingPaperId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPaperId(null);
                        setPaperForm({ name: '', size: 'Full Sheet (23x36)', gsm: 130, paperType: 'Art Matte', pricePerFullSheet: 6.5 });
                      }}
                      className="bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-3.5 rounded-lg transition text-xs flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-5">Paper Grade Name</th>
                    <th className="py-3 px-5">Sheet Size</th>
                    <th className="py-3 px-5 text-center">GSM</th>
                    <th className="py-3 px-5">Type</th>
                    <th className="py-3 px-5 text-right">Price / FS (INR)</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {papers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition">
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-slate-100">{paper.name}</td>
                      <td className="py-3.5 px-5 font-mono text-xs">{paper.size}</td>
                      <td className="py-3.5 px-5 text-center font-mono">{paper.gsm}</td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">{paper.paperType}</td>
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-indigo-600">₹{paper.pricePerFullSheet.toFixed(2)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => startEditPaper(paper)}
                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition rounded hover:bg-slate-100 dark:bg-slate-700/50 cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePaper(paper.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 2: LAMINATION RATES */}
        {activeTab === 'lamination' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveLam} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingLamId ? 'Edit Lamination Polish Rate' : 'Add Lamination Polish Rate'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Lamination Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Matte Lamination"
                    value={lamForm.name}
                    onChange={(e) => setLamForm({ ...lamForm, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Rate per Sq Inch (₹)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={lamForm.ratePerSqInch}
                    onChange={(e) => setLamForm({ ...lamForm, ratePerSqInch: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {editingLamId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingLamId ? 'Save Changes' : 'Add Lamination'}
                  </button>
                  {editingLamId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLamId(null);
                        setLamForm({ name: '', ratePerSqInch: 0.15 });
                      }}
                      className="bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-lg transition text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl max-w-2xl">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-5">Lamination Type Polish</th>
                    <th className="py-3 px-5 text-right">Rate per Square Inch (INR)</th>
                    <th className="py-3 px-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laminations.map((lam) => (
                    <tr key={lam.id} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition">
                      <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">{lam.name}</td>
                      <td className="py-3 px-5 text-right font-mono text-emerald-600 font-bold">₹{lam.ratePerSqInch.toFixed(3)}</td>
                      <td className="py-3 px-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => startEditLam(lam)}
                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition rounded hover:bg-indigo-50 cursor-pointer"
                            title="Edit Lamination"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLam(lam.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete Rate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 2b: PLATE PROFILES */}
        {activeTab === 'plates' && (
          <div className="space-y-8">
            <form onSubmit={handleSavePlate} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingPlateId ? 'Edit Plate Profile' : 'Add Plate Profile'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Plate Name / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard PS Plate (A4/A3)"
                    value={plateForm.name}
                    onChange={(e) => setPlateForm({ ...plateForm, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Rate per Plate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={plateForm.cost}
                    onChange={(e) => setPlateForm({ ...plateForm, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingPlateId ? 'Save Changes' : 'Create Profile'}
                </button>
                {editingPlateId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlateId(null);
                      setPlateForm({ name: '', cost: 400 });
                    }}
                    className="bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-lg transition text-xs flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl max-w-2xl">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-5">Plate Profile Name</th>
                    <th className="py-3 px-5 text-right">Price per Plate (INR)</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plateProfiles && plateProfiles.length > 0 ? (
                    plateProfiles.map((plate) => (
                      <tr key={plate.id} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition">
                        <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">{plate.name}</td>
                        <td className="py-3 px-5 text-right font-mono text-indigo-600 font-bold">₹{plate.cost.toFixed(2)}</td>
                        <td className="py-3 px-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => startEditPlate(plate)}
                              className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition rounded hover:bg-slate-100 dark:bg-slate-700/50 cursor-pointer"
                              title="Edit Profile"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlate(plate.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 transition rounded hover:bg-rose-50 cursor-pointer"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 px-5 text-center text-slate-400 text-xs font-mono">
                        No plate profiles registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 3: MISCELLANEOUS & POST-PRESS COSTS */}
        {activeTab === 'misc' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveMisc} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                {editingMiscId ? 'Edit Miscellaneous Cost Preset' : 'Add Miscellaneous Cost Preset'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Process Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Perfect Binding"
                    value={miscForm.name}
                    onChange={(e) => setMiscForm({ ...miscForm, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Calculation Type</label>
                  <select
                    value={miscForm.type}
                    onChange={(e) => setMiscForm({ ...miscForm, type: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  >
                    <option value="fixed">Fixed Charge (Flat Rate)</option>
                    <option value="per_unit">Per Unit (Multiplies by Qty)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cost Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={miscForm.cost}
                    onChange={(e) => setMiscForm({ ...miscForm, cost: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono font-bold"
                  />
                </div>
                <div className="flex items-end md:col-span-2 gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {editingMiscId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingMiscId ? 'Save Changes' : 'Save Cost Preset'}
                  </button>
                  {editingMiscId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMiscId(null);
                        setMiscForm({ name: '', type: 'fixed', cost: 1000 });
                      }}
                      className="bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-lg transition text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-5">Process / Cost Component</th>
                    <th className="py-3 px-5">Pricing Type</th>
                    <th className="py-3 px-5 text-right">Base Cost Preset (INR)</th>
                    <th className="py-3 px-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {miscCosts.map((cost) => (
                    <tr key={cost.id} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition">
                      <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">{cost.name}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                          cost.type === 'fixed' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {cost.type === 'fixed' ? 'Fixed Flat Rate' : 'Per Unit basis'}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-mono font-bold">
                        ₹{cost.cost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        {cost.type === 'per_unit' && <span className="text-[10px] text-slate-400 font-normal"> / item</span>}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => startEditMisc(cost)}
                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition rounded hover:bg-indigo-50 cursor-pointer"
                            title="Edit Preset"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMisc(cost.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete Preset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 4: PRINTING COST BRACKET TEIRS */}
        {activeTab === 'brackets' && (
          <form onSubmit={handleSaveBracketsConfig} className="space-y-6 max-w-3xl bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex justify-between items-end">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Review & Edit Printing Impression Brackets</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Customize the tier thresholds and flat base pricing rates used for feeding impressions.
                </p>
              </div>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full max-w-md mb-6">
              <button
                type="button"
                onClick={() => setBracketTab('multi_color')}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition ${bracketTab === 'multi_color' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Multi-Color
              </button>
              <button
                type="button"
                onClick={() => setBracketTab('single_color')}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition ${bracketTab === 'single_color' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Single Color
              </button>
              <button
                type="button"
                onClick={() => setBracketTab('single_color_double_dummy')}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition ${bracketTab === 'single_color_double_dummy' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Single Double Dummy
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Bracket Tier 1
                </label>
                <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.bracket1?.maxImpressions || 0}
                      onChange={(e) => updateBracketField('bracket1', 'maxImpressions', parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                    />
                  </div>
                  <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.bracket1?.cost || 0}
                      onChange={(e) => updateBracketField('bracket1', 'cost', parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                    />
                  </div>
                </div>
              </div>
              {bracketTab === 'multi_color' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Bracket Tier 2
                    </label>
                    <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket2?.maxImpressions || 0}
                          onChange={(e) => updateBracketField('bracket2', 'maxImpressions', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                        />
                      </div>
                      <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket2?.cost || 0}
                          onChange={(e) => updateBracketField('bracket2', 'cost', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Bracket Tier 3
                    </label>
                    <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket3?.maxImpressions || 0}
                          onChange={(e) => updateBracketField('bracket3', 'maxImpressions', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                        />
                      </div>
                      <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket3?.cost || 0}
                          onChange={(e) => updateBracketField('bracket3', 'cost', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Excess / Overage Pricing Rules
                </label>
                <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Per Impression Step</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.excessStepImpressions || 0}
                      onChange={(e) => updateBracketField('excessStepImpressions', null, parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                    />
                  </div>
                  <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Overage Step Cost (₹)</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.excessStepCost || 0}
                      onChange={(e) => updateBracketField('excessStepCost', null, parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-rose-600 focus:outline-none pt-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition shadow active:scale-[0.99] flex items-center gap-1.5 cursor-pointer mt-6"
            >
              <Save className="w-4 h-4" />
              Save Brackets Configuration
            </button>
          </form>
        )}

        {/* PANEL 5: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateUser} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Provision New Employee Account
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@press.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  >
                    <option value="employee">Employee / Estimator</option>
                    <option value="admin">Administrator (Full Access)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Secure Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition text-xs shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Provision Account
              </button>
            </form>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-5">Name</th>
                    <th className="py-3 px-5">Email Address</th>
                    <th className="py-3 px-5">System Role</th>
                    <th className="py-3 px-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {systemUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition">
                      <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                      <td className="py-3 px-5 font-mono text-xs">{u.email}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                          u.role === 'admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                        }`}>
                          {u.role === 'admin' ? 'Administrator' : 'Employee'}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition rounded hover:bg-rose-50 cursor-pointer"
                            title="Deactivate Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
