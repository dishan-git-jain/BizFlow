import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_TYPES } from '../../data/businessPresets';

export const EmployeeModal = ({ isOpen, onClose, employeeToEdit = null }) => {
  const { user } = useAuth();
  const { createEmployee, updateEmployee } = useData();

  // Dynamic Departments based on user's business type
  const userDepartments = React.useMemo(() => {
    if (user?.departments && user.departments.length > 0) {
      return user.departments;
    }
    if (user?.businessType) {
      const preset = BUSINESS_TYPES.find(b => b.id === user.businessType);
      if (preset) return preset.departments;
    }
    return [
      'Operations', 'Finance', 'Sales', 'Logistics', 
      'Support', 'Procurement', 'Human Resources', 'Marketing'
    ];
  }, [user]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: userDepartments[0] || 'Operations'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        role: employeeToEdit.role || '',
        department: employeeToEdit.department || userDepartments[0] || 'Operations'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        department: userDepartments[0] || 'Operations'
      });
    }
    setErrors({});
  }, [employeeToEdit, isOpen, userDepartments]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Employee name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.role.trim()) errs.role = 'Role / job title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.id, formData);
      } else {
        await createEmployee(formData);
      }
      onClose();
    } catch (err) {
      console.error('Employee submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Ramesh Kumar, Chef Suresh, Sunita Devi"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border ${
              errors.name ? 'border-rose-500' : 'border-slate-700'
            } text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm`}
          />
          {errors.name && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            placeholder="ramesh@mybusiness.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border ${
              errors.email ? 'border-rose-500' : 'border-slate-700'
            } text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm`}
          />
          {errors.email && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>}
        </div>

        {/* Role & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Role / Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Head Chef, Front Desk Lead, Cashier"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border ${
                errors.role ? 'border-rose-500' : 'border-slate-700'
              } text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm`}
            />
            {errors.role && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
            >
              {userDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            {submitting ? 'Saving...' : employeeToEdit ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
