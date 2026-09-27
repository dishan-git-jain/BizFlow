import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { 
  fetchTasks as localFetchTasks, 
  fetchEmployees as localFetchEmployees, 
  createTask as localCreateTask, 
  updateTask as localUpdateTask, 
  deleteTask as localDeleteTask,
  createEmployee as localCreateEmployee,
  updateEmployee as localUpdateEmployee,
  deleteEmployee as localDeleteEmployee,
  fetchShifts as localFetchShifts,
  createShift as localCreateShift,
  updateShift as localUpdateShift,
  deleteShift as localDeleteShift,
  fetchAuditLogs as localFetchAuditLogs,
  logActivity as localLogActivity,
  loadBusinessPresetDataForUser,
  clearUserData
} from '../services/storageService';
import { isOverdue } from '../utils/helpers';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const recordLog = useCallback(async (action, details) => {
    try {
      const newLog = await localLogActivity(userId, action, details);
      setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
    } catch (e) {
      console.warn('Log activity error:', e);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setEmployees([]);
      setShifts([]);
      setAuditLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [fetchedTasks, fetchedEmployees, fetchedShifts, fetchedLogs] = await Promise.all([
        localFetchTasks(userId),
        localFetchEmployees(userId),
        localFetchShifts(userId),
        localFetchAuditLogs(userId)
      ]);
      setTasks(fetchedTasks || []);
      setEmployees(fetchedEmployees || []);
      setShifts(fetchedShifts || []);
      setAuditLogs(fetchedLogs || []);
    } catch (err) {
      console.error('Failed to load user workspace data:', err);
      setError('Unable to load workspace data.');
    } finally {
      setLoading(false);
    }
  }, [user, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Dynamic KPI Calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overdue = tasks.filter(t => isOverdue(t)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      completionRate
    };
  }, [tasks]);

  // Dynamic Business Insights
  const insights = useMemo(() => {
    const list = [];

    if (tasks.length === 0) {
      list.push({
        id: 'ins-empty',
        type: 'info',
        title: 'New Workspace Ready',
        text: 'Your workspace is ready. Add your first employee and create a task to begin tracking!'
      });
      return list;
    }

    if (stats.overdue > 0) {
      list.push({
        id: 'ins-overdue',
        type: 'danger',
        title: 'Action Required',
        text: `${stats.overdue} task${stats.overdue > 1 ? 's are' : ' is'} currently overdue.`
      });
    } else {
      list.push({
        id: 'ins-overdue',
        type: 'success',
        title: 'On Schedule',
        text: 'All pending tasks are within their scheduled deadlines.'
      });
    }

    if (employees.length > 0 && tasks.length > 0) {
      const empCompletedCounts = employees.map(emp => {
        const count = tasks.filter(t => t.assignedTo === emp.id && t.status === 'Completed').length;
        return { name: emp.name.split(' ')[0], count };
      }).sort((a, b) => b.count - a.count);

      if (empCompletedCounts[0] && empCompletedCounts[0].count > 0) {
        list.push({
          id: 'ins-performer',
          type: 'info',
          title: 'Top Performer',
          text: `${empCompletedCounts[0].name} has completed ${empCompletedCounts[0].count} task${empCompletedCounts[0].count > 1 ? 's' : ''}.`
        });
      }
    }

    const criticalPending = tasks.filter(t => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Completed').length;
    if (criticalPending > 0) {
      list.push({
        id: 'ins-priority',
        type: 'warning',
        title: 'Priority Warning',
        text: `${criticalPending} High/Critical priority tasks require attention.`
      });
    }

    list.push({
      id: 'ins-rate',
      type: 'neutral',
      title: 'Workflow Efficiency',
      text: `Completion rate is currently at ${stats.completionRate}%.`
    });

    return list;
  }, [tasks, employees, stats]);

  // TASK ACTIONS
  const handleCreateTask = async (taskData) => {
    try {
      let created;
      try {
        const res = await api.createTask(taskData);
        created = res.task;
      } catch (err) {
        created = await localCreateTask(userId, taskData);
      }
      setTasks(prev => [created, ...prev]);
      addToast(`Task "${created.title}" created!`, 'success');
      return created;
    } catch (err) {
      addToast('Failed to create task', 'error');
      throw err;
    }
  };

  const handleUpdateTask = async (id, updateData) => {
    try {
      let updated;
      try {
        const res = await api.updateTask(id, updateData);
        updated = res.task;
      } catch (err) {
        updated = await localUpdateTask(userId, id, updateData);
      }
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      addToast('Task updated successfully', 'success');
      return updated;
    } catch (err) {
      addToast('Failed to update task', 'error');
      throw err;
    }
  };

  const handleChangeTaskStatus = async (id, newStatus) => {
    try {
      let updated;
      try {
        const res = await api.updateTask(id, { status: newStatus });
        updated = res.task;
      } catch (err) {
        updated = await localUpdateTask(userId, id, { status: newStatus });
      }
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      
      if (newStatus === 'Completed') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
        addToast(`Task marked as Completed! 🎉`, 'success');
      } else {
        addToast(`Task status changed to ${newStatus}`, 'info');
      }
      return updated;
    } catch (err) {
      addToast('Failed to change task status', 'error');
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      try {
        await api.deleteTask(id);
      } catch (err) {
        await localDeleteTask(userId, id);
      }
      setTasks(prev => prev.filter(t => t.id !== id));
      addToast(`Task "${taskToDelete?.title || id}" deleted`, 'delete');
    } catch (err) {
      addToast('Failed to delete task', 'error');
      throw err;
    }
  };

  // EMPLOYEE ACTIONS
  const handleCreateEmployee = async (empData) => {
    try {
      let created;
      try {
        const res = await api.createEmployee(empData);
        created = res.employee;
      } catch (err) {
        created = await localCreateEmployee(userId, empData);
      }
      setEmployees(prev => [created, ...prev]);
      addToast(`Employee ${created.name} added!`, 'success');
      return created;
    } catch (err) {
      addToast('Failed to add employee', 'error');
      throw err;
    }
  };

  const handleUpdateEmployee = async (id, empData) => {
    try {
      let updated;
      try {
        const res = await api.updateEmployee(id, empData);
        updated = res.employee;
      } catch (err) {
        updated = await localUpdateEmployee(userId, id, empData);
      }
      setEmployees(prev => prev.map(e => e.id === id ? updated : e));
      addToast('Employee updated', 'success');
      return updated;
    } catch (err) {
      addToast('Failed to update employee', 'error');
      throw err;
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const empToDelete = employees.find(e => e.id === id);
      try {
        await api.deleteEmployee(id);
      } catch (err) {
        await localDeleteEmployee(userId, id);
      }
      setEmployees(prev => prev.filter(e => e.id !== id));
      addToast(`Employee ${empToDelete?.name || id} removed`, 'delete');
    } catch (err) {
      addToast('Failed to remove employee', 'error');
      throw err;
    }
  };

  const handleLoadBusinessPresetData = async (businessTypeId) => {
    setLoading(true);
    try {
      try {
        const res = await api.loadPreset(businessTypeId);
        setTasks(res.tasks);
        setEmployees(res.employees);
      } catch (err) {
        const data = await loadBusinessPresetDataForUser(userId, businessTypeId);
        setTasks(data.tasks);
        setEmployees(data.employees);
      }
      addToast('Loaded preset for your business!', 'success');
    } catch (err) {
      addToast('Failed to load business preset data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      try {
        const res = await api.clearPreset();
        setTasks(res.tasks);
        setEmployees(res.employees);
      } catch (err) {
        const data = await clearUserData(userId);
        setTasks(data.tasks);
        setEmployees(data.employees);
      }
      addToast('Workspace reset to empty clean state!', 'info');
    } catch (err) {
      addToast('Failed to clear workspace data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // SHIFT ACTIONS
  const handleCreateShift = async (shiftData) => {
    try {
      if (Array.isArray(shiftData)) {
        const createdList = [];
        for (const s of shiftData) {
          const created = await localCreateShift(userId, s);
          createdList.push(created);
        }
        setShifts(prev => [...createdList, ...prev]);
        const emp = employees.find(e => e.id === shiftData[0]?.employeeId);
        addToast(`Full month shifts (${createdList.length} days) scheduled for ${emp?.name || 'employee'}!`, 'success');
        recordLog('Monthly Shift Scheduled', `Scheduled ${createdList.length} days of ${shiftData[0]?.shiftType} for ${emp?.name || 'staff'}`);
        return createdList;
      }

      const created = await localCreateShift(userId, shiftData);
      setShifts(prev => [created, ...prev]);
      const emp = employees.find(e => e.id === shiftData.employeeId);
      addToast(`Shift scheduled for ${emp?.name || 'employee'}`, 'success');
      recordLog('Shift Scheduled', `Assigned ${shiftData.shiftType} on ${shiftData.date} to ${emp?.name || 'staff'}`);
      return created;
    } catch (err) {
      addToast('Failed to schedule shift', 'error');
      throw err;
    }
  };

  const handleUpdateShift = async (id, updateData) => {
    try {
      const updated = await localUpdateShift(userId, id, updateData);
      setShifts(prev => prev.map(s => s.id === id ? updated : s));
      addToast('Shift status updated', 'info');
      recordLog('Shift Updated', `Updated shift status to ${updateData.status || 'modified'}`);
      return updated;
    } catch (err) {
      addToast('Failed to update shift', 'error');
      throw err;
    }
  };

  const handleDeleteShift = async (id) => {
    try {
      await localDeleteShift(userId, id);
      setShifts(prev => prev.filter(s => s.id !== id));
      addToast('Shift removed', 'delete');
      recordLog('Shift Deleted', `Removed shift entry ${id}`);
    } catch (err) {
      addToast('Failed to delete shift', 'error');
      throw err;
    }
  };

  // WHATSAPP REMINDER
  const sendWhatsAppReminder = (task) => {
    const emp = employees.find(e => e.id === task.assignedTo);
    const empName = emp?.name || 'Staff Member';
    const taskTitle = task.title;
    const deadline = task.deadline || 'Today';
    const msg = `Hi ${empName}, urgent reminder regarding task "${taskTitle}" due on ${deadline}. Please complete it as soon as possible.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    addToast(`WhatsApp reminder prepared for ${empName}`, 'info');
    recordLog('WhatsApp Reminder Sent', `Sent deadline alert for "${taskTitle}" to ${empName}`);
  };

  return (
    <DataContext.Provider value={{
      tasks,
      employees,
      shifts,
      auditLogs,
      loading,
      error,
      stats,
      insights,
      loadData,
      recordLog,
      createTask: handleCreateTask,
      updateTask: handleUpdateTask,
      changeTaskStatus: handleChangeTaskStatus,
      deleteTask: handleDeleteTask,
      createEmployee: handleCreateEmployee,
      updateEmployee: handleUpdateEmployee,
      deleteEmployee: handleDeleteEmployee,
      createShift: handleCreateShift,
      updateShift: handleUpdateShift,
      deleteShift: handleDeleteShift,
      sendWhatsAppReminder,
      loadBusinessPresetData: handleLoadBusinessPresetData,
      clearData: handleClearData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
