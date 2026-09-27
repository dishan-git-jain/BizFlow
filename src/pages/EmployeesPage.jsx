import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { EmployeeCard } from '../components/employees/EmployeeCard';
import { EmployeeModal } from '../components/employees/EmployeeModal';
import { EmptyState } from '../components/common/EmptyState';
import { Users, Plus, Search } from 'lucide-react';

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const { employees, tasks, deleteEmployee } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEmpForEdit, setSelectedEmpForEdit] = useState(null);

  const departments = useMemo(() => {
    const set = new Set(employees.map(e => e.department));
    return ['All', ...Array.from(set)];
  }, [employees]);

  // Compute per-employee stats
  const employeeStatsMap = useMemo(() => {
    const map = {};
    employees.forEach(emp => {
      const empTasks = tasks.filter(t => t.assignedTo === emp.id);
      const completed = empTasks.filter(t => t.status === 'Completed').length;
      const pending = empTasks.filter(t => t.status !== 'Completed').length;
      const total = empTasks.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      map[emp.id] = { total, completed, pending, completionRate };
    });
    return map;
  }, [employees, tasks]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, deptFilter]);

  const handleDelete = (emp) => {
    if (window.confirm(`Are you sure you want to remove employee ${emp.name}?`)) {
      deleteEmployee(emp.id);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Employee Directory</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Manage your team members, roles, and individual productivity.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search & Department Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search employee by name, role, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                Department: {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Cards Grid */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees found"
          description="Your workspace currently has no staff members added."
          actionLabel="Add New Employee"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              stats={employeeStatsMap[emp.id]}
              onView={(e) => navigate(`/employees/${e.id}`)}
              onEdit={(e) => setSelectedEmpForEdit(e)}
              onDelete={(e) => handleDelete(e)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isAddOpen || Boolean(selectedEmpForEdit)}
        onClose={() => {
          setIsAddOpen(false);
          setSelectedEmpForEdit(null);
        }}
        employeeToEdit={selectedEmpForEdit}
      />
    </div>
  );
};
