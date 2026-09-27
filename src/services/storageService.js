import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  doc, 
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { BUSINESS_TYPES, getPresetById } from '../data/businessPresets';

const getTasksKey = (userId) => `bizflow_tasks_${userId || 'guest'}`;
const getEmployeesKey = (userId) => `bizflow_employees_${userId || 'guest'}`;

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatLocalDate(d);
};

// Load Business Preset Dataset into User's Account
export const loadBusinessPresetDataForUser = async (userId, businessTypeId) => {
  const preset = getPresetById(businessTypeId);
  const tasksKey = getTasksKey(userId);
  const employeesKey = getEmployeesKey(userId);

  const employees = preset.sampleEmployees.map((emp, index) => ({
    id: `emp-${Date.now().toString(36)}-${index}`,
    userId,
    name: emp.name,
    email: `${emp.name.toLowerCase().replace(/[^a-z]/g, '')}@bizflow.com`,
    role: emp.role,
    department: emp.department,
    avatarBg: ['bg-slate-800', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600'][index % 4],
    createdAt: getRelativeDate(-30)
  }));

  const tasks = preset.sampleTasks.map((t, index) => {
    const assignedEmp = employees[index % employees.length] || employees[0];
    return {
      id: `task-${Date.now().toString(36)}-${index}`,
      userId,
      title: t.title,
      description: t.description,
      assignedTo: assignedEmp ? assignedEmp.id : '',
      priority: t.priority,
      status: t.status,
      deadline: getRelativeDate(t.deadlineOffset || 0),
      createdAt: getRelativeDate(-5),
      updatedAt: getRelativeDate(-1)
    };
  });

  localStorage.setItem(tasksKey, JSON.stringify(tasks));
  localStorage.setItem(employeesKey, JSON.stringify(employees));

  if (isFirebaseConfigured && db) {
    try {
      for (const emp of employees) {
        await setDoc(doc(db, 'users', userId, 'employees', emp.id), emp);
      }
      for (const t of tasks) {
        await setDoc(doc(db, 'users', userId, 'tasks', t.id), t);
      }
    } catch (err) {
      console.warn('Firestore preset load warning:', err);
    }
  }

  return { tasks, employees };
};

// Reset / Clear all data for a specific user
export const clearUserData = async (userId) => {
  const tasksKey = getTasksKey(userId);
  const employeesKey = getEmployeesKey(userId);

  localStorage.setItem(tasksKey, JSON.stringify([]));
  localStorage.setItem(employeesKey, JSON.stringify([]));

  return { tasks: [], employees: [] };
};

// EMPLOYEES CRUD (Per UserId)
export const fetchEmployees = async (userId) => {
  const key = getEmployeesKey(userId);
  const raw = localStorage.getItem(key);

  if (raw !== null) {
    return JSON.parse(raw);
  }

  // All accounts get an empty array by default
  localStorage.setItem(key, JSON.stringify([]));
  return [];
};

export const createEmployee = async (userId, employeeData) => {
  const key = getEmployeesKey(userId);
  const id = `emp-${Date.now().toString(36)}`;
  const newEmp = {
    id,
    userId,
    ...employeeData,
    avatarBg: employeeData.avatarBg || 'bg-slate-800',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [newEmp, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', userId, 'employees', id), newEmp);
    } catch (err) {
      console.warn('Firestore create employee warning:', err);
    }
  }

  return newEmp;
};

export const updateEmployee = async (userId, id, updateData) => {
  const key = getEmployeesKey(userId);
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = existing.map(e => e.id === id ? { ...e, ...updateData } : e);
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'users', userId, 'employees', id), updateData);
    } catch (err) {
      console.warn('Firestore update employee warning:', err);
    }
  }

  return updated.find(e => e.id === id);
};

export const deleteEmployee = async (userId, id) => {
  const key = getEmployeesKey(userId);
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = existing.filter(e => e.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'employees', id));
    } catch (err) {
      console.warn('Firestore delete employee warning:', err);
    }
  }

  return id;
};

// TASKS CRUD (Per UserId)
export const fetchTasks = async (userId) => {
  const key = getTasksKey(userId);
  const raw = localStorage.getItem(key);

  if (raw !== null) {
    return JSON.parse(raw);
  }

  // All accounts get an empty array by default
  localStorage.setItem(key, JSON.stringify([]));
  return [];
};

export const createTask = async (userId, taskData) => {
  const key = getTasksKey(userId);
  const id = `task-${Date.now().toString(36)}`;
  const todayStr = new Date().toISOString().split('T')[0];
  const newTask = {
    id,
    userId,
    ...taskData,
    status: taskData.status || 'Pending',
    priority: taskData.priority || 'Medium',
    createdAt: todayStr,
    updatedAt: todayStr
  };

  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [newTask, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', userId, 'tasks', id), newTask);
    } catch (err) {
      console.warn('Firestore create task warning:', err);
    }
  }

  return newTask;
};

export const updateTask = async (userId, id, updateData) => {
  const key = getTasksKey(userId);
  const todayStr = new Date().toISOString().split('T')[0];
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = existing.map(t => t.id === id ? { ...t, ...updateData, updatedAt: todayStr } : t);
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', id), { ...updateData, updatedAt: todayStr });
    } catch (err) {
      console.warn('Firestore update task warning:', err);
    }
  }

  return updated.find(t => t.id === id);
};

export const deleteTask = async (userId, id) => {
  const key = getTasksKey(userId);
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = existing.filter(t => t.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'tasks', id));
    } catch (err) {
      console.warn('Firestore delete task warning:', err);
    }
  }

  return id;
};

// SHIFTS CRUD
const getShiftsKey = (userId) => `bizflow_shifts_${userId || 'guest'}`;
const getAuditLogsKey = (userId) => `bizflow_audit_logs_${userId || 'guest'}`;

export const fetchShifts = async (userId) => {
  const key = getShiftsKey(userId);
  const raw = localStorage.getItem(key);
  if (raw !== null) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify([]));
  return [];
};

export const createShift = async (userId, shiftData) => {
  const key = getShiftsKey(userId);
  const id = `shift-${Date.now().toString(36)}`;
  const newShift = {
    id,
    userId,
    ...shiftData,
    status: shiftData.status || 'Scheduled',
    createdAt: new Date().toISOString()
  };
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [newShift, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));
  return newShift;
};

export const updateShift = async (userId, id, updateData) => {
  const key = getShiftsKey(userId);
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = existing.map(s => s.id === id ? { ...s, ...updateData } : s);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated.find(s => s.id === id);
};

export const deleteShift = async (userId, id) => {
  const key = getShiftsKey(userId);
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = existing.filter(s => s.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
  return id;
};

// AUDIT LOGS
export const fetchAuditLogs = async (userId) => {
  const key = getAuditLogsKey(userId);
  const raw = localStorage.getItem(key);
  if (raw !== null) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify([]));
  return [];
};

export const logActivity = async (userId, action, details) => {
  const key = getAuditLogsKey(userId);
  const newLog = {
    id: `log-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    action,
    details
  };
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [newLog, ...existing.slice(0, 99)];
  localStorage.setItem(key, JSON.stringify(updated));
  return newLog;
};
