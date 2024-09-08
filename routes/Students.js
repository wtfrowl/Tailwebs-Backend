const express = require('express');
const router = express.Router();
const Student = require('../models/Students');

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST a new student
router.post('/', async (req, res) => {
  const { name, subject, marks } = req.body;

  try {
    let student = await Student.findOne({ name, subject });

    if (student) {
      student.marks = marks;
      await student.save();
      return res.json({ msg: 'Student marks updated', student });
    }

    student = new Student({ name, subject, marks });
    await student.save();
    res.json({ msg: 'New student added', student });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH (edit) student details
router.patch('/:id', async (req, res) => {

    const { name, subject, marks,...extra } = req.body;
  
    try {
      let student = await Student.findById(req.params.id);
  
      if (!student) {
        return res.status(404).json({ msg: 'Student not found' });
      }
  
      // Update only the provided fields
      if (name !== undefined) student.name = name;
      if (subject !== undefined) student.subject = subject;
      if (marks !== undefined) student.marks = marks;
  
      await student.save();
      res.json({ msg: 'Student details updated', student });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log(`Attempting to delete student with id: ${studentId}`);
    
    let student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    await Student.findByIdAndDelete(studentId);
    console.log(`Deleted student: ${studentId}`);
    res.json({ msg: 'Student deleted' });
  } catch (err) {
    console.error(`Error deleting student: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
