import React from 'react';
import { getInitials } from '../../utils/helpers';
import { Mail, Briefcase, ChevronRight, Edit2, Trash2 } from 'lucide-react';

export const EmployeeCard = ({ employee, stats, onView, onEdit, onDelete }) => {
  const { total = 0, completed = 0, pending = 0, completionRate = 0 } = stats || {};

  return (
    <div 
      onClick={() => onView(employee)}
      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 flex flex-col justify-between group"
    >
      <div>
        {/* Header: Avatar, Name, Department */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${employee.avatarBg || 'bg-indigo-600'} text-white font-black text-base flex items-center justify-center shadow-md shadow-indigo-600/20`}>
              {getInitials(employee.name)}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                {employee.name}
              </h3>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{employee.role}</span>
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            {employee.department}
          </span>
        </div>

        {/* Email */}
        <div className="text-xs font-semibold text-slate-600 flex items-center gap-2 mb-4 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{employee.email}</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Completion Rate</span>
            <span className="text-emerald-700 font-extrabold">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Mini stats counters */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
            <span className="text-sm font-extrabold text-slate-900">{total}</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Done</span>
            <span className="text-sm font-extrabold text-emerald-600">{completed}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active</span>
            <span className="text-sm font-extrabold text-amber-600">{pending}</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div 
        className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onView(employee)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(employee)}
            title="Edit Employee"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            title="Delete Employee"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
