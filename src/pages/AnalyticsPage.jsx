import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const AnalyticsPage = () => {
  const { tasks, employees, stats } = useData();

  // 1. Tasks by Status
  const statusData = useMemo(() => {
    const counts = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0
    };
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });

    return [
      { name: 'Pending', value: counts.Pending, color: '#f59e0b' },
      { name: 'In Progress', value: counts['In Progress'], color: '#4f46e5' },
      { name: 'Completed', value: counts.Completed, color: '#10b981' }
    ];
  }, [tasks]);

  // 2. Tasks by Priority
  const priorityData = useMemo(() => {
    const counts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };
    tasks.forEach(t => {
      if (counts[t.priority] !== undefined) counts[t.priority]++;
    });

    return [
      { name: 'Critical', count: counts.Critical, fill: '#e11d48' },
      { name: 'High', count: counts.High, fill: '#d97706' },
      { name: 'Medium', count: counts.Medium, fill: '#4f46e5' },
      { name: 'Low', count: counts.Low, fill: '#0284c7' }
    ];
  }, [tasks]);

  // 3. Employee Productivity
  const employeeProductivityData = useMemo(() => {
    return employees.map(emp => {
      const empTasks = tasks.filter(t => t.assignedTo === emp.id);
      const completed = empTasks.filter(t => t.status === 'Completed').length;
      const pending = empTasks.filter(t => t.status !== 'Completed').length;

      return {
        name: emp.name.split(' ')[0],
        fullName: emp.name,
        Completed: completed,
        Active: pending
      };
    });
  }, [employees, tasks]);

  // Custom Light Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs font-bold space-y-1 text-slate-900">
          <p className="text-slate-800">{label || payload[0].name}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color || p.fill }}>
              {p.name}: <strong className="text-slate-900">{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12 text-slate-900">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Productivity & Business Analytics</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Visual insights into small business task distribution, status, and employee performance.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          title="Overall Completion"
          value={`${stats.completionRate}%`}
          subtext={`${stats.completed} of ${stats.total} tasks finished`}
          colorScheme="emerald"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue Tasks"
          value={stats.overdue}
          subtext={stats.overdue > 0 ? "Requires schedule adjustment" : "Zero overdue tasks!"}
          colorScheme="rose"
        />
        <StatCard
          icon={Users}
          title="Active Team Members"
          value={employees.length}
          subtext="Distributed across departments"
          colorScheme="indigo"
        />
        <StatCard
          icon={CheckCircle2}
          title="In-Flight Tasks"
          value={stats.pending + stats.inProgress}
          subtext="Current active backlog"
          colorScheme="amber"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Donut Chart: Tasks by Status */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <span>Tasks by Status</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">Status Breakdown</span>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-2xl font-black text-slate-900">{stats.total}</span>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase">Total Tasks</span>
            </div>
          </div>
        </div>

        {/* Bar Chart: Tasks by Priority */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              <span>Tasks by Priority Level</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">Urgency Distribution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-p-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full-width Stacked Bar Chart: Employee Productivity */}
        <div className="lg:col-span-12 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Employee Productivity Breakdown</span>
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Completed vs Active tasks per employee across departments.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeProductivityData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Active" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
