const { getStudentDetails } = require("./students");
const Student = require("../models/student");
const bcrypt = require('bcrypt');

const addNewStudents = (newStudents) => {
  newStudents.forEach(async (n) => {
    const {
      year,
      branch,
      div,
      my_batch: batch,
      subjects,
    } = getStudentDetails(n.roll_no);

    const hashedPassword = bcrypt.hashSync("123456", 14);

    let studentExists = await Student.findOne({email: n.email});
    if(!studentExists){
      let student = new Student({
        name: n.name,
        email: n.email,
        password: hashedPassword,
        roll_no: n.roll_no,
        registration_id: n.registration_id,
        year,
        branch,
        subjects,
        batch,
        div,
      });
      await student.save();
    }
  });
};

module.exports = addNewStudents;
