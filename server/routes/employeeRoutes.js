import express from 'express';
import { readDb, writeDb } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/employees
router.get('/', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const employees = db.employees[uid] || [];
  return res.json({ success: true, employees });
});

// POST /api/employees
router.post('/', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;

  const { name, email, role, department } = req.body;
  if (!name || !role) {
    return res.status(400).json({ success: false, error: 'Employee name and role required' });
  }

  const newEmp = {
    id: `emp-${Date.now().toString(36)}`,
    userId: uid,
    name,
    email: email || '',
    role,
    department: department || 'General',
    avatarBg: getRandomAvatarBg(),
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (!db.employees[uid]) {
    db.employees[uid] = [];
  }

  db.employees[uid].unshift(newEmp);
  writeDb(db);

  return res.status(201).json({ success: true, employee: newEmp });
});

// PUT /api/employees/:id
router.put('/:id', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const empId = req.params.id;

  const empList = db.employees[uid] || [];
  const index = empList.findIndex(e => e.id === empId);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Employee not found' });
  }

  const updated = { ...empList[index], ...req.body };
  empList[index] = updated;
  db.employees[uid] = empList;
  writeDb(db);

  return res.json({ success: true, employee: updated });
});

// DELETE /api/employees/:id
router.delete('/:id', (req, res) => {
  const db = readDb();
  const uid = req.user.uid;
  const empId = req.params.id;

  const empList = db.employees[uid] || [];
  db.employees[uid] = empList.filter(e => e.id !== empId);
  writeDb(db);

  return res.json({ success: true, id: empId });
});

const getRandomAvatarBg = () => {
  const colors = [
    'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 
    'bg-amber-600', 'bg-indigo-600', 'bg-pink-600'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default router;
