import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_TYPES } from '../data/businessPresets';
import { 
  Settings, 
  Database, 
  Building, 
  Cloud, 
  CheckCircle2, 
  Trash2,
  User,
  Store
} from 'lucide-react';

export const SettingsPage = () => {
  const { clearData, tasks, employees } = useData();
  const { user, updateUserProfile } = useAuth();

  const [username, setUsername] = useState(user?.name || '');
  const [bizType, setBizType] = useState(user?.businessType || 'sweet_shop');
  const [bizName, setBizName] = useState(user?.businessName || 'My Business Workspace');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
      setBizType(user.businessType || 'sweet_shop');
      setBizName(user.businessName || `${user.name || 'My'}'s Business Workspace`);
    }
  }, [user]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const preset = BUSINESS_TYPES.find(b => b.id === bizType) || BUSINESS_TYPES[0];
    updateUserProfile({
      name: username.trim(),
      businessType: bizType,
      businessName: bizName.trim(),
      departments: preset.departments
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          <span>Platform & Business Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Logged in as: <strong className="text-slate-800">{user?.name}</strong> ({user?.email})
        </p>
      </div>

      {/* Profile & Business Type Customization Form */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-700" />
          <span>Profile & Business Configuration</span>
        </h3>

        {saved && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username / Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Username / Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Ramesh Kumar, Chef Vikram"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Business / Company Name
              </label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="e.g. Royal Sweet Shop & Bakery"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Business Type Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Business Industry Category
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={bizType}
                onChange={(e) => setBizType(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {BUSINESS_TYPES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting an industry adapts department filters for employees and task management.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>

      {/* Preset & Data Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Workspace Data Controls */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" />
              <span>Workspace Items</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {tasks.length} Tasks, {employees.length} Staff
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Clear all tasks and employees in your account workspace to start clean.
          </p>

          <div className="pt-2">
            <button
              onClick={clearData}
              className="w-full py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors border border-red-200 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Account Data</span>
            </button>
          </div>
        </div>

        {/* Cloud Run Deployment Readiness */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cloud className="w-4 h-4 text-slate-700" />
              <span>Google Cloud Run Status</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Dockerized
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Multi-tenant container architecture listening on port <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">$PORT</code>.
          </p>

          <div className="space-y-1.5 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-800" />
              <span>Isolated Per-User Database Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-800" />
              <span>Dynamic Username & Department System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
