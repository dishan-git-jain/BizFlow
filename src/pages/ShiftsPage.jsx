import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ShiftModal } from '../components/shifts/ShiftModal';
import { EmptyState } from '../components/common/EmptyState';
import { getInitials } from '../utils/helpers';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Users, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  LogOut,
  Trash2,
  Filter
} from 'lucide-react';

export const ShiftsPage = () => {
  const { shifts, employees, updateShift, deleteShift } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const filteredShifts = shifts.filter(s => {
    if (!dateFilter) return true;
    return s.date === dateFilter;
  });

  const clockedInCount = shifts.filter(s => s.status === 'Clocked In').length;
  const scheduledCount = shifts.filter(s => s.status === 'Scheduled').length;
  const absentCount = shifts.filter(s => s.status === 'Absent').length;

  const handleStatusChange = (shiftId, newStatus) => {
    updateShift(shiftId, { status: newStatus });
  };

  const handleDelete = (shiftId) => {
    if (window.confirm('Remove this shift record?')) {
      deleteShift(shiftId);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-slate-800" />
            <span>Shift Schedule & Attendance</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Track daily working hours, staff shifts, and clock-in / clock-out attendance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Shift</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Clocked In Now</span>
            <span className="text-2xl font-black text-emerald-700">{clockedInCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Scheduled Shifts</span>
            <span className="text-2xl font-black text-slate-900">{scheduledCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Absences Recorded</span>
            <span className="text-2xl font-black text-red-700">{absentCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filter by Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Showing {filteredShifts.length} shift record{filteredShifts.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Shifts List Grid */}
      {filteredShifts.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No shifts scheduled"
          description="Schedule working shifts for your team members to monitor daily attendance and hours."
          actionLabel="Schedule First Shift"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShifts.map((shift) => {
            const emp = employees.find(e => e.id === shift.employeeId);

            let statusStyle = 'bg-slate-100 text-slate-800 border-slate-300';
            if (shift.status === 'Clocked In') statusStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold';
            if (shift.status === 'Clocked Out') statusStyle = 'bg-blue-50 text-blue-800 border-blue-300';
            if (shift.status === 'Absent') statusStyle = 'bg-red-50 text-red-800 border-red-300';

            return (
              <div 
                key={shift.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Header: Employee Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {getInitials(emp?.name || 'Staff')}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{emp?.name || 'Employee'}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{emp?.role || 'Team Member'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(shift.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Shift"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Shift Hours & Status Badge */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{shift.shiftType}</span>
                    </span>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] border ${statusStyle}`}>
                      {shift.status}
                    </span>
                  </div>

                  {/* Date & Station Note */}
                  <div className="text-[11px] text-slate-500 font-medium space-y-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>Date: <strong className="text-slate-800">{shift.date}</strong></div>
                    {shift.notes && <div>Location/Station: <span className="text-slate-700">{shift.notes}</span></div>}
                  </div>
                </div>

                {/* Clock-In / Clock-Out Interactive Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {shift.status !== 'Clocked In' ? (
                    <button
                      onClick={() => handleStatusChange(shift.id, 'Clocked In')}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Clock In</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(shift.id, 'Clocked Out')}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Clock Out</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleStatusChange(shift.id, 'Absent')}
                    className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Mark Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Shift Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
