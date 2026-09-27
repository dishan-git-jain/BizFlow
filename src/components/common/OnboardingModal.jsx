import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BUSINESS_TYPES } from '../../data/businessPresets';
import { 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Store, 
  Hotel, 
  ShoppingBag, 
  Wrench, 
  Activity, 
  Briefcase 
} from 'lucide-react';

const ICON_MAP = {
  Store: Store,
  Hotel: Hotel,
  ShoppingBag: ShoppingBag,
  Wrench: Wrench,
  Activity: Activity,
  Briefcase: Briefcase
};

export const OnboardingModal = () => {
  const { user, updateUserProfile } = useAuth();
  const { loadBusinessPresetData } = useData();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedType, setSelectedType] = useState('sweet_shop');
  const [businessName, setBusinessName] = useState('');
  const [loadSample, setLoadSample] = useState(false); // Default false so accounts start 100% clean unless checked!

  useEffect(() => {
    if (user && (!user.name || !user.businessType || user.name === user.email.split('@')[0])) {
      setUsername(user.name !== user.email.split('@')[0] ? user.name : '');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  if (!isOpen) return null;

  const currentPreset = BUSINESS_TYPES.find(b => b.id === selectedType) || BUSINESS_TYPES[0];

  const handleSelectBusinessType = (typeId) => {
    setSelectedType(typeId);
    const preset = BUSINESS_TYPES.find(b => b.id === typeId);
    if (preset && !businessName) {
      const defaultName = `${username || 'My'} ${preset.name.split('/')[0].trim()}`;
      setBusinessName(defaultName);
    }
  };

  const handleCompleteOnboarding = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your full name or username.');
      return;
    }

    const updatedProfile = {
      name: username.trim(),
      businessType: selectedType,
      businessName: businessName.trim() || `${username}'s Workspace`,
      departments: currentPreset.departments,
      onboarded: true
    };

    updateUserProfile(updatedProfile);

    if (loadSample && loadBusinessPresetData) {
      await loadBusinessPresetData(selectedType);
    }

    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl z-10 overflow-hidden transform transition-all my-8 p-6 sm:p-8 space-y-6 text-slate-900">
        
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
            <Sparkles className="w-4 h-4" />
            <span>Welcome Setup • Step {step} of 2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* STEP 1: Enter Username / Full Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                What should we call you? 👋
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Enter your username or full name so your team members can identify you on task assignments.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Username / Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-indigo-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Ramesh Kumar, Anjali Sharma, Owner Vikram"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-bold"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!username.trim()) {
                    alert('Please enter your name.');
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <span>Next: Choose Business Type</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Business Type & Preset Departments */}
        {step === 2 && (
          <form onSubmit={handleCompleteOnboarding} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                What type of business do you manage? 🏪
              </h2>
              <p className="text-xs font-medium text-slate-600">
                Select your business industry. We will automatically customize your department filters and task templates!
              </p>
            </div>

            {/* Business Type Selection Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {BUSINESS_TYPES.map((b) => {
                const IconComponent = ICON_MAP[b.icon] || Briefcase;
                const isSelected = selectedType === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBusinessType(b.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-indigo-600'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
                        <span>{b.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500 leading-tight">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Configured Departments Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-indigo-700 block uppercase tracking-wider">
                Tailored Departments for {currentPreset.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentPreset.departments.map((dept, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Checkbox: Load Tailored Sample Data */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="loadSampleCheck"
                checked={loadSample}
                onChange={(e) => setLoadSample(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600 bg-white border-slate-300 cursor-pointer"
              />
              <label htmlFor="loadSampleCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                Optionally pre-load sample tasks & employees for <strong className="text-indigo-600">{currentPreset.name.split('/')[0]}</strong> (Leave unchecked to start 100% empty)
              </label>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <span>Complete Setup & Launch Workspace</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
