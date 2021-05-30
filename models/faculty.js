const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
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
  batches: [{
    type: String,
    default: "",
  }],
  branch: {
    type: String,
    required: true,
  },
  registration_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("faculty", facultySchema);
