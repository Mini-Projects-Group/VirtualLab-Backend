const { TE, addLab } = require('../utils/labUtils');
const Lab = require('../models/lab');
const router = require('express').Router();
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const passport = require('passport');

// @route    GET /api/faculty/branch?branch=xyz
// @desc     GET faculty of a particular branch
// @access   Private Only access to admin
router.get('/branch', async (req, res) => {
    let { branch } = req.query;

    let results = await Faculty.find({branch});
    let students = await Student.find({branch});
    res.send({error: false, results, students});
});

// @route    GET /api/faculty/labs
// @desc     GET labs of particular faculty
// @access   Private access to faculty
router.get('/labs',passport.authenticate('jwt',{ session: false }), async (req, res) => {
    let results = await Lab.find({faculty: req.user._id});
    res.send({error: false, results});
});



module.exports = router;