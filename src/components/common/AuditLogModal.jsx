import React, { useState } from 'react';
import { X, History, Clock, Filter, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AuditLogModal = ({ isOpen, onClose }) => {
  const { auditLogs } = useData();
  const [filterText, setFilterText] = useState('');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(log => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return log.action.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 text-slate-900 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <span>Activity Audit Log & History Trail</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Timestamped log of task creations, status changes, employee reviews, and shift updates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit logs by action or detail..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Audit Log Timeline Items */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-medium space-y-1">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No activity log entries found.</p>
              <p className="text-[11px] text-slate-400">Actions like creating tasks, marking shifts, or updating status will appear here.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const formattedTime = new Date(log.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {formattedTime}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">
                    {log.details}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Audit Log
          </button>
        </div>

      </div>
    </div>
  );
};
