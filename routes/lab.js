const { TE, addLab } = require("../utils/labUtils");
const Lab = require("../models/lab");
const router = require("express").Router();

// @route    GET /api/labs/all
// @desc     CREATE EMPTY LABS
// @access   Private Only access to admin

router.get("/all", async (req, res) => {
  let branches = Object.keys(TE);
  branches.forEach(async (branch) => {
    let { Subjects, Batches, Class } = TE[branch];

    // FOR EACH Subject, Batch, Class

    for (let i = 0; i < Subjects.length; i++) {
      for (let j = 0; j < Batches.length; j++) {
        for (let k = 0; k < Class.length; k++) {
          await addLab(Subjects[i], branch, 3, Batches[j] + Class[k], [], null);
        }
      }
    }
  });

  return res.send({ error: false, message: "Labs have been created" });
});

// @route    GET /api/labs/getAll
// @desc     Get all labs
// @access   Private Only access to admin
router.get("/getAll", async (req, res) => {
  let results = await Lab.find({}).populate("students").populate("faculty");
  res.send({ error: false, results });
});

// @route    POST /api/labs/new
// @desc     CREATE EMPTY LABS
// @access   Private Only access to admin

router.post("/new", async (req, res) => {
  const { subject, branch, year, faculty } = req.body;

  const { Class, Batches } = TE[branch];
  for (let j = 0; j < Batches.length; j++) {
    for (let k = 0; k < Class.length; k++) {
      await addLab(subject, branch, year, Batches[j] + Class[k], [], faculty);
    }
  }

  return res.send({ error: false, message: "Lab has been created" });
});

// @route    POST /api/labs/add/faculty
// @desc     add faculty to a lab
// @access   Private Only access to admin
router.post("/add/faculty", async (req, res) => {
  let { faculty_id } = req.body;
  let { lab_id } = req.query;

  await Lab.findByIdAndUpdate(lab_id, { $set: { faculty: faculty_id } });
  res.send({ error: false, message: "Faculty has been added to lab" });
});

// @route    POST /api/labs/add/students
// @desc     add students to a lab
// @access   Private Only access to admin
router.post("/add/students", async (req, res) => {
  let { students } = req.body; // should be array
  let { lab_id } = req.query;

  await Lab.findByIdAndUpdate(lab_id, {
    $push: { students: { $each: students } },
  });
  res.send({ error: false, message: "Students have been added to lab" });
});

// @route    POST /api/labs/remove/students
// @desc     remove students from a lab
// @access   Private Only access to admin
router.post("/remove/students", async (req, res) => {
  let { students } = req.body; // should be array
  let { lab_id } = req.query;

  await Lab.findByIdAndUpdate(lab_id, {
    $pull: { students: { $in: students } },
  });
  res.send({ error: false, message: "Students have been removed from lab" });
});

// @route    GET /api/labs/getLab
// @desc     get a lab
// @access   PRIVATE to student and teachers

router.get("/getLab", async (req, res) => {
  const curr_lab = await Lab.findById(req.query.id);
  if (!curr_lab) res.send({ error: true, message: "Lab doesn't exist" });
  else return res.send({ error: false, labData: curr_lab });
});

module.exports = router;
