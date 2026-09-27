import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Repeat } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SHIFT_TYPES = [
  'Morning Shift (8 AM - 4 PM)',
  'Evening Shift (4 PM - 12 AM)',
  'Night Shift (12 AM - 8 AM)',
  'Full Day (9 AM - 6 PM)'
];

export const ShiftModal = ({ isOpen, onClose }) => {
  const { employees, createShift } = useData();

  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftType, setShiftType] = useState(SHIFT_TYPES[0]);
  const [durationMode, setDurationMode] = useState('month'); // 'month' | 'week' | 'single'
  const [status, setStatus] = useState('Scheduled');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return;

    setSubmitting(true);
    try {
      let shiftCount = 1;
      if (durationMode === 'month') shiftCount = 30;
      if (durationMode === 'week') shiftCount = 7;

      const baseDate = new Date(startDate);
      const shiftList = [];

      for (let i = 0; i < shiftCount; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        shiftList.push({
          employeeId,
          date: dateStr,
          shiftType,
          status: i === 0 ? status : 'Scheduled',
          notes: notes.trim()
        });
      }

      if (shiftList.length === 1) {
        await createShift(shiftList[0]);
      } else {
        await createShift(shiftList);
      }

      onClose();
      setEmployeeId('');
      setNotes('');
    } catch (err) {
      console.error('Failed to create monthly shifts:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 text-slate-900">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Schedule Monthly Shift
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Automatically schedules shift for the entire month (30 days).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Employee */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Select Staff Member</span>
            </label>
            <select
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Shift Start Date</span>
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Repeat Duration Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-slate-500" />
              <span>Schedule Repeat Duration</span>
            </label>
            <select
              value={durationMode}
              onChange={(e) => setDurationMode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="month">Full Month (30 Consecutive Days)</option>
              <option value="week">1 Week (7 Consecutive Days)</option>
              <option value="single">Single Day Only</option>
            </select>
          </div>

          {/* Shift Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Shift Hours</span>
            </label>
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {SHIFT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Notes / Work Station</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Front Counter, Kitchen, Register 2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
            {durationMode === 'month' && '📅 Will schedule 30 daily shifts starting from ' + startDate}
            {durationMode === 'week' && '📅 Will schedule 7 daily shifts starting from ' + startDate}
            {durationMode === 'single' && '📅 Will schedule 1 single shift on ' + startDate}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !employeeId}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors disabled:opacity-50"
            >
              {submitting ? 'Generating Shifts...' : `Schedule ${durationMode === 'month' ? 'Full Month' : 'Shift'}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
