const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true }
});

module.exports = mongoose.model('Student', StudentSchema);
