import express from 'express';
import { readDb, writeDb } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/tasks
router.get('/', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const tasks = db.tasks[uid] || [];
  return res.json({ success: true, tasks });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;

  const { title, description, assignedTo, priority, deadline, status } = req.body;
  if (!title || !assignedTo || !deadline) {
    return res.status(400).json({ success: false, error: 'Task title, assigned employee, and deadline required' });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const newTask = {
    id: `task-${Date.now().toString(36)}`,
    userId: uid,
    title,
    description: description || '',
    assignedTo,
    priority: priority || 'Medium',
    status: status || 'Pending',
    deadline,
    createdAt: todayStr,
    updatedAt: todayStr
  };

  if (!db.tasks[uid]) {
    db.tasks[uid] = [];
  }

  db.tasks[uid].unshift(newTask);
  writeDb(db);

  return res.status(201).json({ success: true, task: newTask });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const taskId = req.params.id;

  const taskList = db.tasks[uid] || [];
  const index = taskList.findIndex(t => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const updated = { ...taskList[index], ...req.body, updatedAt: todayStr };
  taskList[index] = updated;
  db.tasks[uid] = taskList;
  writeDb(db);

  return res.json({ success: true, task: updated });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const taskId = req.params.id;

  const taskList = db.tasks[uid] || [];
  db.tasks[uid] = taskList.filter(t => t.id !== taskId);
  writeDb(db);

  return res.json({ success: true, id: taskId });
});

export default router;
