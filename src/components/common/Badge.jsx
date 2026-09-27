import React from 'react';
import { getPriorityBadge, getStatusBadge, isOverdue } from '../../utils/helpers';
import { AlertTriangle, Clock, CheckCircle2, CircleDashed } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  const config = getPriorityBadge(priority);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const config = getStatusBadge(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${config.bg}`}>
      {status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
      {status === 'In Progress' && <Clock className="w-3 h-3 text-blue-700" />}
      {status === 'Pending' && <CircleDashed className="w-3 h-3 text-slate-500" />}
      {config.label}
    </span>
  );
};

export const OverdueBadge = ({ task }) => {
  if (!isOverdue(task)) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
      <AlertTriangle className="w-3 h-3 text-red-700" />
      OVERDUE
    </span>
  );
};
