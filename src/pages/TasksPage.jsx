import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskKanban } from '../components/tasks/TaskKanban';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Search, 
  Plus, 
  LayoutList, 
  Kanban, 
  RotateCcw, 
  CheckSquare
} from 'lucide-react';
import { isOverdue } from '../utils/helpers';

export const TasksPage = () => {
  const { tasks, employees } = useData();

  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesEmployee = employeeFilter === 'All' || t.assignedTo === employeeFilter;
      const matchesOverdue = !overdueOnly || isOverdue(t);

      return matchesSearch && matchesStatus && matchesPriority && matchesEmployee && matchesOverdue;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, employeeFilter, overdueOnly, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setEmployeeFilter('All');
    setOverdueOnly(false);
    setSortBy('deadline');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'All' || priorityFilter !== 'All' || employeeFilter !== 'All' || overdueOnly;

  return (
    <div className="space-y-6 pb-12 text-slate-900">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            <span>Task Management</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Organize, filter, and track tasks across your team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tasks by title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="lg:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="All">Priority: All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Employee Filter */}
          <div className="lg:col-span-2">
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="All">Employee: All</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="deadline">Sort: Deadline</option>
              <option value="priority">Sort: Priority</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>

        {/* Filter Quick Badges & Reset Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                overdueOnly
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              ⚠️ Overdue Only
            </button>
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{filteredTasks.length}</strong> of {tasks.length} tasks
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Content View */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="There are no tasks matching your search or filters in this workspace."
          actionLabel="Create New Task"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : viewMode === 'table' ? (
        <TaskTable
          tasks={filteredTasks}
          onSelectTask={(task) => setSelectedTaskForView(task)}
          onEditTask={(task) => setSelectedTaskForEdit(task)}
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
          onSelectTask={(task) => setSelectedTaskForView(task)}
          onEditTask={(task) => setSelectedTaskForEdit(task)}
        />
      )}

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
