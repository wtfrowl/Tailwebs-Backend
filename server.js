const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors=require('cors')
const port = 3333;
const teacher =require('./routes/Auth');
const student= require('./routes/Students')
app.use(cors());
app.use(express.json());
app.use('/api/auth',teacher)
app.use('/api/students',student)
mongoose.connect('mongodb://localhost:27017/teacherPortal', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));
