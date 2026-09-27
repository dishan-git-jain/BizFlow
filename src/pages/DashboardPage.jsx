import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { PriorityBadge, OverdueBadge } from '../components/common/Badge';
import { formatDate, getInitials, isOverdue } from '../utils/helpers';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  CircleDashed,
  ArrowRight,
  Plus,
  Users,
  Layers,
  Star,
  ShieldCheck,
  Award,
  TrendingUp,
  UserCheck
} from 'lucide-react';

// Automated Data-Driven Work Evaluation Helper
const computeWorkEvaluation = (emp, tasks) => {
  const empTasks = tasks.filter(t => t.assignedTo === emp.id);
  const total = empTasks.length;
  const completed = empTasks.filter(t => t.status === 'Completed').length;
  const pending = empTasks.filter(t => t.status !== 'Completed').length;
  const overdue = empTasks.filter(t => t.status !== 'Completed' && isOverdue(t)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (total === 0) {
    return {
      rating: 3,
      status: 'Awaiting Work Assignment',
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-300',
      summary: 'No tasks assigned yet. Assign work to start evaluating employee capability.',
      capable: true,
      total,
      completed,
      pending,
      overdue,
      completionRate
    };
  }

  if (completionRate >= 80 && overdue === 0) {
    return {
      rating: 5,
      status: 'Capable of Staying (Top Work Output)',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      summary: `Completed ${completed} of ${total} assigned tasks (${completionRate}% completion rate). 0 overdue tasks. High capability to stay.`,
      capable: true,
      total,
      completed,
      pending,
      overdue,
      completionRate
    };
  }

  if (completionRate >= 60 && overdue <= 1) {
    return {
      rating: 4,
      status: 'Capable of Staying (Good Work)',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      summary: `Completed ${completed} of ${total} tasks (${completionRate}% completion rate). ${overdue > 0 ? `${overdue} overdue.` : 'On schedule.'} Capable of staying.`,
      capable: true,
      total,
      completed,
      pending,
      overdue,
      completionRate
    };
  }

  if (completionRate >= 40 && overdue <= 1) {
    return {
      rating: 3,
      status: 'Satisfactory (Meeting Expectations)',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-300',
      summary: `Completed ${completed} of ${total} tasks (${completionRate}% completion rate). Satisfactory work output.`,
      capable: true,
      total,
      completed,
      pending,
      overdue,
      completionRate
    };
  }

  if (completionRate < 40 && overdue <= 1) {
    return {
      rating: 2,
      status: 'Under Observation (Low Completion)',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300',
      summary: `Only ${completed} of ${total} tasks completed (${completionRate}% rate). Needs work output improvement.`,
      capable: false,
      total,
      completed,
      pending,
      overdue,
      completionRate
    };
  }

  return {
    rating: 1,
    status: 'At Risk (Unsatisfactory Work Output)',
    badgeStyle: 'bg-red-50 text-red-800 border-red-300',
    summary: `${overdue} overdue task(s) and low task completion (${completionRate}%). High risk / low work capability.`,
    capable: false,
    total,
    completed,
    pending,
    overdue,
    completionRate
  };
};

export const DashboardPage = ({ onOpenCreateTask }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, employees, stats, insights } = useData();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const overdueTasks = tasks.filter(t => isOverdue(t)).slice(0, 5);
  const isWorkspaceEmpty = tasks.length === 0 && employees.length === 0;

  // Automated Evaluations Map
  const employeeEvaluations = employees.map(emp => ({
    employee: emp,
    eval: computeWorkEvaluation(emp, tasks)
  }));

  const capableCount = employeeEvaluations.filter(item => item.eval.capable).length;
  const atRiskCount = employeeEvaluations.filter(item => !item.eval.capable).length;

  return (
    <div className="space-y-6 pb-12 text-slate-900">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl text-white shadow-2xs">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-400">
            {formattedDate}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {greeting}, {user?.name || 'Manager'}
          </h1>
          <p className="text-xs text-slate-400">
            Workspace Account: {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/tasks')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700"
          >
            View Tasks
          </button>
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Clean Empty State Banner */}
      {isWorkspaceEmpty && (
        <div className="p-7 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-5 text-center max-w-2xl mx-auto my-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Welcome to your new Workspace!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your account is completely empty. Add your team members and tasks below to begin.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => navigate('/employees')}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Add Employees</span>
            </button>

            <button
              onClick={onOpenCreateTask}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CheckSquare}
          title="Total Tasks"
          value={stats.total}
          subtext="In workspace"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          icon={CircleDashed}
          title="Pending"
          value={stats.pending}
          subtext="Awaiting action"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={stats.inProgress}
          subtext="Active working"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          icon={CheckCircle2}
          title="Completed"
          value={stats.completed}
          subtext={`${stats.completionRate}% completion rate`}
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={stats.overdue}
          subtext={stats.overdue > 0 ? "Needs attention" : "All on schedule"}
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Work-Based Automated Employee Capability Reviews (ON DASHBOARD ONLY) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Work-Based Employee Capability Reviews</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Automated capability evaluations calculated strictly on assigned work completion and task deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{capableCount} Capable of Staying</span>
            </span>
            {atRiskCount > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{atRiskCount} Low Capability / Risk</span>
              </span>
            )}
          </div>
        </div>

        {/* Dashboard Employee Review Cards */}
        {employees.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-800">No Employees Evaluated Yet</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Add staff members and assign tasks to automatically measure their work performance and retention suitability.
            </p>
            <button
              onClick={() => navigate('/employees')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold mt-1"
            >
              + Add First Employee
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employeeEvaluations.map(({ employee: emp, eval: ev }) => {
              return (
                <div 
                  key={emp.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{emp.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{emp.role} • {emp.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating & Work Capability Badge */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= ev.rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-slate-700 ml-1">
                          {ev.rating}/5 Score
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${ev.badgeStyle}`}>
                        {ev.status}
                      </span>
                    </div>

                    {/* Work Completion Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-600">Work Output Rate</span>
                        <span className="font-bold text-slate-900">{ev.completionRate}% ({ev.completed}/{ev.total} tasks)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                        <div 
                          className="bg-slate-900 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${ev.completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Work Evaluation Summary */}
                    <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium leading-snug">
                      {ev.summary}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-slate-600" />
                      <span>{ev.overdue > 0 ? `${ev.overdue} overdue task(s)` : '0 Overdue Tasks'}</span>
                    </span>
                    <button
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="text-slate-900 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>View Tasks</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Workspace Insights */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Workspace Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider block text-slate-500 mb-1">
                  {ins.title}
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {ins.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Overdue Tasks */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Overdue & Urgent Tasks
            </h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {overdueTasks.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">No Overdue Tasks</p>
                <p className="text-[11px] text-slate-500">All pending tasks are within their deadlines.</p>
              </div>
            ) : (
              overdueTasks.map((t) => {
                const emp = employees.find(e => e.id === t.assignedTo);
                return (
                  <div
                    key={t.id}
                    onClick={() => navigate('/tasks')}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={t.priority} />
                        <OverdueBadge task={t} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{t.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span>Assigned: <strong className="text-slate-700">{emp?.name || 'Unassigned'}</strong></span>
                        <span>•</span>
                        <span className="text-red-700 font-semibold">Deadline: {formatDate(t.deadline)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Team Summary */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Team Summary
            </h2>
            <button
              onClick={() => navigate('/employees')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Manage Team</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            {employees.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-medium space-y-2">
                <p>No employees added yet.</p>
                <button
                  onClick={() => navigate('/employees')}
                  className="px-3 py-1 rounded bg-slate-900 text-white font-semibold text-xs"
                >
                  + Add Employee
                </button>
              </div>
            ) : (
              employees.slice(0, 5).map((emp) => {
                const empTasks = tasks.filter(t => t.assignedTo === emp.id);
                const completedCount = empTasks.filter(t => t.status === 'Completed').length;
                const pendingCount = empTasks.filter(t => t.status !== 'Completed').length;
                const rate = empTasks.length > 0 ? Math.round((completedCount / empTasks.length) * 100) : 0;

                return (
                  <div 
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{emp.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{emp.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700">{rate}%</span>
                      <p className="text-[10px] text-slate-500">{completedCount} done / {pendingCount} active</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
