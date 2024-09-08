const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher'); // Changed from User to Teacher

const JWT_SECRET = 'your_jwt_secret';

// Signup Route (POST /api/auth/signup)
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the teacher already exists
    let teacher = await Teacher.findOne({ username });
    if (teacher) {
      return res.status(400).json({ msg: 'Teacher already exists' });
    }

    // Create new teacher
    teacher = new Teacher({
      username,
      password,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(password, salt);

    // Save the teacher to the database
    await teacher.save();

    // Generate JWT token
    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, teacher: { id: teacher._id, username: teacher.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route (POST /api/auth/login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find teacher by username
    let teacher = await Teacher.findOne({ username });
    if (!teacher) {
      return res.status(400).json({ msg: 'Teacher not found' });
    }

    // Check if password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, teacher: { id: teacher._id, username: teacher.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
