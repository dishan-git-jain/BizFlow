import React from 'react';
import { PriorityBadge, StatusBadge, OverdueBadge } from '../common/Badge';
import { formatDate, getInitials, isOverdue } from '../../utils/helpers';
import { useData } from '../../context/DataContext';
import { Eye, Edit2, Trash2, Calendar } from 'lucide-react';

export const TaskTable = ({ tasks, onSelectTask, onEditTask }) => {
  const { employees, changeTaskStatus, deleteTask } = useData();

  const getEmployee = (empId) => employees.find(e => e.id === empId);

  const handleDelete = (e, taskId, title) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse min-w-[750px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
            <th className="py-4 px-6">Task Title</th>
            <th className="py-4 px-4">Assigned To</th>
            <th className="py-4 px-4">Priority</th>
            <th className="py-4 px-4">Deadline</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {tasks.map((task) => {
            const emp = getEmployee(task.assignedTo);
            const taskIsOverdue = isOverdue(task);

            return (
              <tr
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                  taskIsOverdue ? 'bg-rose-50/40' : ''
                }`}
              >
                {/* Task Title & Description */}
                <td className="py-4 px-6 max-w-xs sm:max-w-md">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </span>
                      {taskIsOverdue && <OverdueBadge task={task} />}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>

                {/* Assigned Employee */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${emp?.avatarBg || 'bg-indigo-600'} text-white font-black text-[10px] flex items-center justify-center shadow-xs`}>
                      {getInitials(emp?.name || 'Unassigned')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">
                        {emp?.name || 'Unassigned'}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {emp?.role || 'Staff'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Deadline */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Calendar className={`w-3.5 h-3.5 ${taskIsOverdue ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span className={taskIsOverdue ? 'text-rose-700 font-extrabold' : 'text-slate-700'}>
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={(e) => changeTaskStatus(task.id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectTask(task)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditTask(task)}
                      title="Edit Task"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, task.id, task.title)}
                      title="Delete Task"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
