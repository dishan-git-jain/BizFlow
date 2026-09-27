import React from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge, StatusBadge, OverdueBadge } from '../common/Badge';
import { formatDate, getInitials, isOverdue } from '../../utils/helpers';
import { useData } from '../../context/DataContext';
import { Calendar, User, Clock, Trash2, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';

export const TaskDetailModal = ({ isOpen, onClose, task, onEdit }) => {
  const { employees, changeTaskStatus, deleteTask } = useData();

  if (!task) return null;

  const assignedEmp = employees.find(e => e.id === task.assignedTo);
  const taskIsOverdue = isOverdue(task);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      await deleteTask(task.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Header Status & Overdue Alert */}
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          {taskIsOverdue && <OverdueBadge task={task} />}
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-2">
            {task.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            {task.description || 'No detailed description provided for this task.'}
          </p>
        </div>

        {/* Assigned Employee Card */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${assignedEmp?.avatarBg || 'bg-indigo-600'} text-white font-bold text-xs flex items-center justify-center shadow-md`}>
              {getInitials(assignedEmp?.name || 'Unassigned')}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Employee</p>
              <p className="text-sm font-bold text-slate-100">{assignedEmp?.name || 'Unassigned'}</p>
              <p className="text-xs text-slate-400">{assignedEmp?.role} ({assignedEmp?.department})</p>
            </div>
          </div>
        </div>

        {/* Deadline & Timestamps Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${taskIsOverdue ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-800/40 border-slate-700/60'}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Deadline</span>
            </div>
            <p className={`text-sm font-bold ${taskIsOverdue ? 'text-rose-400' : 'text-slate-100'}`}>
              {formatDate(task.deadline)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Created Date</span>
            </div>
            <p className="text-sm font-bold text-slate-100">
              {formatDate(task.createdAt)}
            </p>
          </div>
        </div>

        {/* Change Quick Status */}
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Quick Update Status</span>
          <div className="flex flex-wrap gap-2">
            {['Pending', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => changeTaskStatus(task.id, st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  task.status === st
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition-colors border border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
