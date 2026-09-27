import express from 'express';
import jwt from 'jsonwebtoken';
import { readDb, writeDb } from '../db/database.js';
import { JWT_SECRET, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate & Send OTP
router.post('/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email address required' });
  }

  const db = readDb();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  db.otps[email] = { code, expiresAt };
  writeDb(db);

  return res.json({
    success: true,
    message: `OTP generated for ${email}`,
    code
  });
});

// Verify OTP & Sign In / Register User
router.post('/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email and OTP code required' });
  }

  const db = readDb();
  const storedOtp = db.otps[email];

  if (!storedOtp || storedOtp.code !== code) {
    return res.status(400).json({ success: false, error: 'Invalid OTP code' });
  }

  if (Date.now() > storedOtp.expiresAt) {
    return res.status(400).json({ success: false, error: 'OTP code has expired' });
  }

  delete db.otps[email];

  const uid = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Ensure new user gets a completely EMPTY database for tasks and employees
  if (!db.users[uid]) {
    db.users[uid] = {
      uid,
      email,
      name: email.split('@')[0],
      role: 'Business Owner',
      businessType: '',
      businessName: '',
      departments: [],
      createdAt: new Date().toISOString()
    };
    db.tasks[uid] = [];
    db.employees[uid] = [];
  } else {
    // If user exists, initialize arrays if missing
    if (!db.tasks[uid]) db.tasks[uid] = [];
    if (!db.employees[uid]) db.employees[uid] = [];
  }

  writeDb(db);

  const user = db.users[uid];
  const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    success: true,
    token,
    user
  });
});

// Get Current Logged-in User
router.get('/me', authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users[req.user.uid];
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  return res.json({ success: true, user });
});

// Update Profile & Business Settings
router.put('/profile', authMiddleware, (req, res) => {
  const { name, businessType, businessName, departments } = req.body;
  const db = readDb();

  const user = db.users[req.user.uid];
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (name !== undefined) user.name = name;
  if (businessType !== undefined) user.businessType = businessType;
  if (businessName !== undefined) user.businessName = businessName;
  if (departments !== undefined) user.departments = departments;

  writeDb(db);

  return res.json({ success: true, user });
});

export default router;
