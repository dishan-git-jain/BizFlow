import express from 'express';
import { readDb, writeDb } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { BUSINESS_TYPES, getPresetById } from '../../src/data/businessPresets.js';

const router = express.Router();
router.use(authMiddleware);

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

// POST /api/presets/load
router.post('/load', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const { businessType } = req.body;

  const preset = getPresetById(businessType || 'sweet_shop');

  // Generate Employees
  const employees = preset.sampleEmployees.map((emp, index) => ({
    id: `emp-${Date.now().toString(36)}-${index}`,
    userId: uid,
    name: emp.name,
    email: `${emp.name.toLowerCase().replace(/[^a-z]/g, '')}@bizflow.com`,
    role: emp.role,
    department: emp.department,
    avatarBg: ['bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'][index % 4],
    createdAt: getRelativeDate(-30)
  }));

  // Generate Tasks
  const tasks = preset.sampleTasks.map((t, index) => {
    const assignedEmp = employees[index % employees.length] || employees[0];
    return {
      id: `task-${Date.now().toString(36)}-${index}`,
      userId: uid,
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

  db.employees[uid] = employees;
  db.tasks[uid] = tasks;
  writeDb(db);

  return res.json({
    success: true,
    message: `Loaded ${preset.name} preset into workspace`,
    tasks,
    employees
  });
});

// POST /api/presets/clear
router.post('/clear', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;

  db.employees[uid] = [];
  db.tasks[uid] = [];
  writeDb(db);

  return res.json({
    success: true,
    message: 'Workspace reset to clean state',
    tasks: [],
    employees: []
  });
});

export default router;
