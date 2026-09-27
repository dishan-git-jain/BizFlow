import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { getInitials, isOverdue } from '../utils/helpers';
import { 
  ArrowLeft, 
  Mail, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CircleDashed,
  Plus
} from 'lucide-react';

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, tasks } = useData();

  const employee = employees.find(e => e.id === id);

  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!employee) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Employee Not Found</h2>
        <p className="text-sm text-slate-400">The requested employee record does not exist.</p>
        <button
          onClick={() => navigate('/employees')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  // Filter tasks assigned to this employee
  const assignedTasks = tasks.filter(t => t.assignedTo === employee.id);

  // Compute stats
  const total = assignedTasks.length;
  const completed = assignedTasks.filter(t => t.status === 'Completed').length;
  const pending = assignedTasks.filter(t => t.status === 'Pending').length;
  const inProgress = assignedTasks.filter(t => t.status === 'In Progress').length;
  const overdue = assignedTasks.filter(t => isOverdue(t)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employees</span>
        </button>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Employee Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 rounded-3xl ${employee.avatarBg || 'bg-indigo-600'} text-white font-black text-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30`}>
            {getInitials(employee.name)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {employee.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {employee.department}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>{employee.role}</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{employee.email}</span>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 w-full md:w-auto text-center md:text-right">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-1">Overall Rating</span>
          <span className="text-2xl font-black text-emerald-400">{completionRate}% Completed</span>
          <span className="text-[11px] text-slate-400 block mt-1">{completed} of {total} assigned tasks done</span>
        </div>
      </div>

      {/* Employee KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CircleDashed}
          title="Total Assigned"
          value={total}
          subtext="Total workload"
          colorScheme="indigo"
        />
        <StatCard
          icon={CircleDashed}
          title="Pending"
          value={pending}
          subtext="Awaiting start"
          colorScheme="amber"
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={inProgress}
          subtext="Active working"
          colorScheme="blue"
        />
        <StatCard
          icon={CheckCircle2}
          title="Completed"
          value={completed}
          subtext={`${completionRate}% success rate`}
          colorScheme="emerald"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={overdue}
          subtext={overdue > 0 ? "Requires attention" : "All on schedule"}
          colorScheme="rose"
        />
      </div>

      {/* Assigned Tasks List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Assigned Tasks ({assignedTasks.length})
        </h2>

        {assignedTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-sm font-medium text-slate-400">No tasks currently assigned to {employee.name}.</p>
          </div>
        ) : (
          <TaskTable
            tasks={assignedTasks}
            onSelectTask={(task) => setSelectedTaskForView(task)}
            onEditTask={(task) => setSelectedTaskForEdit(task)}
          />
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isCreateOpen || Boolean(selectedTaskForEdit)}
        onClose={() => {
          setIsCreateOpen(false);
          setSelectedTaskForEdit(null);
        }}
        taskToEdit={selectedTaskForEdit}
      />

      <TaskDetailModal
        isOpen={Boolean(selectedTaskForView)}
        onClose={() => setSelectedTaskForView(null)}
        task={selectedTaskForView}
        onEdit={(task) => setSelectedTaskForEdit(task)}
      />
    </div>
  );
};
