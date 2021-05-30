const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    max: 255,
    min: 5,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roll_no: {
    type: Number,
    required: true,
  },
  batch: {
    type: String,
    default: "",
  },
  subjects: {
    type: Array,
    default: [],
  },
  branch: {
    type: String,
    required: true,
  },
  div: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  registration_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("student", studentSchema);
