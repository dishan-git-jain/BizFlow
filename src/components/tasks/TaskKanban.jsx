import React from 'react';
import { PriorityBadge, OverdueBadge } from '../common/Badge';
import { formatDate, getInitials, isOverdue } from '../../utils/helpers';
import { useData } from '../../context/DataContext';
import { Calendar, MoveRight, MoveLeft, CheckCircle2, Clock, CircleDashed } from 'lucide-react';

export const TaskKanban = ({ tasks, onSelectTask, onEditTask }) => {
  const { employees, changeTaskStatus } = useData();

  const columns = [
    { key: 'Pending', label: 'Pending', icon: CircleDashed, color: 'text-amber-600' },
    { key: 'In Progress', label: 'In Progress', icon: Clock, color: 'text-indigo-600' },
    { key: 'Completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' }
  ];

  const getEmployee = (empId) => employees.find(e => e.id === empId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.key);
        const ColumnIcon = col.icon;

        return (
          <div key={col.key} className="flex flex-col bg-slate-100/70 rounded-2xl border border-slate-200 p-4 min-h-[500px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ColumnIcon className={`w-5 h-5 ${col.color}`} />
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">{col.label}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Column Task Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {colTasks.length === 0 ? (
                <div className="text-center py-12 text-xs font-bold text-slate-400 border border-dashed border-slate-300 rounded-xl bg-white/40">
                  No {col.label.toLowerCase()} tasks
                </div>
              ) : (
                colTasks.map((task) => {
                  const emp = getEmployee(task.assignedTo);
                  const taskIsOverdue = isOverdue(task);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className={`p-4 rounded-xl bg-white border ${
                        taskIsOverdue ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-indigo-400'
                      } shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5 space-y-3`}
                    >
                      {/* Priority & Overdue Header */}
                      <div className="flex items-center justify-between gap-2">
                        <PriorityBadge priority={task.priority} />
                        {taskIsOverdue && <OverdueBadge task={task} />}
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Footer: Employee & Deadline */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md ${emp?.avatarBg || 'bg-indigo-600'} text-white font-black text-[9px] flex items-center justify-center`}>
                            {getInitials(emp?.name || 'U')}
                          </div>
                          <span className="text-slate-700 text-xs font-bold truncate max-w-[100px]">
                            {emp?.name ? emp.name.split(' ')[0] : 'Unassigned'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                          <Calendar className={`w-3 h-3 ${taskIsOverdue ? 'text-rose-600' : ''}`} />
                          <span className={taskIsOverdue ? 'text-rose-700 font-extrabold' : ''}>
                            {formatDate(task.deadline)}
                          </span>
                        </div>
                      </div>

                      {/* Move Column Controls */}
                      <div 
                        className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {col.key !== 'Pending' ? (
                          <button
                            onClick={() => changeTaskStatus(task.id, col.key === 'Completed' ? 'In Progress' : 'Pending')}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            <MoveLeft className="w-3.5 h-3.5" />
                            <span>Move Back</span>
                          </button>
                        ) : <div />}

                        {col.key !== 'Completed' ? (
                          <button
                            onClick={() => changeTaskStatus(task.id, col.key === 'Pending' ? 'In Progress' : 'Completed')}
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors ml-auto"
                          >
                            <span>Move Next</span>
                            <MoveRight className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
