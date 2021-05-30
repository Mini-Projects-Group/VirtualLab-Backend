const Student = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getStudentDetails } = require("../utils/students");
const passport = require("passport");
const sendMail = require("../utils/mail");
const router = require("express").Router();
const Faculty = require("../models/faculty");

// @route    POST /api/user/register
// @desc     Create new User
// @access   Private Only access to admin
router.post("/register", async (req, res) => {
  if (req.body.type == "student") {
    const { email, name, password, roll_no, registration_id } = req.body;

    let studentPresent = await Student.find({ email });

    console.log(studentPresent);

    if (studentPresent.length != 0)
      return res
        .status(200)
        .send({ error: true, message: "Student already present" });

    const hashedPassword = bcrypt.hashSync(req.body.password.toString(), 14);

    const {
      year,
      branch,
      div,
      my_batch: batch,
      my_subjects: subjects,
    } = getStudentDetails(roll_no);

    let student = new Student({
      name,
      email,
      password: hashedPassword,
      roll_no,
      registration_id,
      year,
      branch,
      subjects,
      batch,
      div,
    });

    await student.save();
    return res.send({ error: false, message: "Student has been created" });
  } else {
    const { email, name, password, branch, registration_id, batches } =
      req.body;

    let facultyPresent = await Faculty.find({ email });

    if (facultyPresent.length != 0)
      return res
        .status(200)
        .send({ error: true, message: "Faculty already present" });

    const hashedPassword = bcrypt.hashSync(password.toString(), 14);

    let faculty = new Faculty({
      name,
      email,
      password: hashedPassword,
      registration_id,
      branch,
      batches,
    });

    await faculty.save();
    return res.send({ error: false, message: "Faculty has been created" });
  }
});

// @route    GET /api/user/getAll/student
// @desc     Get All Student
// @access   Private Only access to admin
router.get("/getAll/student", async (req, res) => {
  const result = await Student.find().sort({ name: 1 });

  return res.send({ error: false, students: result });
});

// @route    GET /api/user/getAll/teacher
// @desc     Get All Teachers
// @access   Private Only access to admin
router.get("/getAll/faculty", async (req, res) => {
  const result = await Faculty.find().sort({ name: 1 });

  return res.send({ error: false, faculties: result });
});

// @route    GET /api/user/getUser/student
// @desc     Get Student data
// @access   Private Only access to student
router.get("/getUser/student", async (req, res) => {
  const { _id } = req.query;

  const result = await Student.findOne({ _id }).select("-password");
  console.log(result);
  return res.send({ error: false, userData: result });
});

// @route    GET /api/user/getUser/faculty
// @desc     Get Faculty data
// @access   Private Only access to faculty
router.get("/getUser/faculty", async (req, res) => {
  const { _id } = req.query;

  const result = await Faculty.findOne({ _id }).select("-password");
  return res.send({ error: false, userData: result });
});

// @route    POST /api/user/login
// @desc     Login User
// @access   Public access

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = null;
  if (req.body.type == "student") {
    user = await Student.findOne({ email });
  } else {
    user = await Faculty.findOne({ email });
  }
  if (!user)
    return res.status(400).send({ error: true, message: "Invalid Email" });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(400).send({ error: true, message: "Invalid Password" });

  const { password: pass, doc } = user._doc;

  const token = jwt.sign(
    { ...doc, _id: user._id, userType: req.body.type },
    process.env.JWT_SECRET,
    {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    }
  );
  return res.send({ error: false, message: "Login Successful", token });
});

// @route    POST /api/user/forgotPassword
// @desc     Forgot password user
// @access   Public

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  let user = null;
  if (req.body.type == "student") user = await Student.findOne({ email });
  else user = await Faculty.findOne({ email });

  if (!user) return res.send({ error: true, message: "Invalid Email" });

  await sendMail("hospitalresourcemanagement@gmail.com", email);

  return res.send({ error: false, message: "Email Sent Successfully !" });
});

// @route    POST /api/user/resetPassword
// @desc     Reset user Password
// @access   Public

router.post("/resetPassword", async (req, res) => {
  const { new_password, email } = req.body;
  let user = null;
  if (req.body.type == "student") user = await Student.findOne({ email });
  else user = await Faculty.findOne({ email });

  if (!user) return res.send({ error: true, message: "Invalid Email" });

  const { password } = user._doc;

  if (bcrypt.compareSync(new_password, password)) {
    return res.send({
      error: true,
      message: "New Password can't be same as old password",
    });
  }

  const hashedPassword = bcrypt.hashSync(new_password, 14);

  await user.update({ password: hashedPassword });
  return res.send({ error: false, message: "Password Updated Successfully !" });
});

// @route    DELETE /api/user/delete/:deleteId
// @desc     Delete user
// @access   Private to admin

router.delete("/delete/:type/:deleteId", async (req, res) => {
  let user = null;
  if (req.params.type == "student") {
    user = await Student.findOne({ email: req.params.deleteId });

    if (!user) return res.send({ error: true, message: "Invalid User" });

    let userDeleted = await Student.deleteOne({ email: req.params.deleteId });
    console.log(userDeleted);
    return res.send({ error: false, message: "Student Deleted Successfully" });
  } else {
    user = await Faculty.findOne({ email: req.params.deleteId });

    if (!user) return res.send({ error: true, message: "Invalid User" });

    let userDeleted = await Faculty.deleteOne({ email: req.params.deleteId });
    console.log(userDeleted);
    return res.send({ error: false, message: "Faculty Deleted Successfully" });
  }
});

// @route    PUT /api/user/update/:updateId
// @desc     Update User
// @access   Private to admin

router.put("/update", async (req, res) => {
  let user = null;
  const { type, ...userDataToBeUpdated } = req.body;
  if (req.body.type == "student") {
    user = await Student.findOne({ email: req.body.email });

    if (!user) return res.send({ error: true, message: "Invalid User" });

    const { roll_no } = userDataToBeUpdated;

    const {
      year,
      branch,
      div,
      my_batch: batch,
      my_subjects: subjects,
    } = getStudentDetails(roll_no);

    const objUpdated = {
      ...userDataToBeUpdated,
      year,
      branch,
      div,
      batch,
      subjects,
    };

    console.log(objUpdated, "ye aya naya");

    let modifiedUser = await Student.updateOne(
      { email: req.body.email },
      { ...objUpdated }
    );

    console.log(modifiedUser);
    return res.send({ error: false, message: "Student modified Successfully" });
  } else {
    user = await Faculty.findOne({ email: req.body.email });

    if (!user) return res.send({ error: true, message: "Invalid User" });

    let modifiedUser = await Faculty.updateOne(
      { email: req.body.email },
      { ...userDataToBeUpdated }
    );
    console.log(modifiedUser);
    return res.send({ error: false, message: "Facutly modified Successfully" });
  }
});

module.exports = router;
