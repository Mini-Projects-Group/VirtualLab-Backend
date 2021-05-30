const { TE, addLab } = require('../utils/labUtils');
const Lab = require('../models/lab');
const router = require('express').Router();
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const passport = require('passport');

// @route    GET /api/student/labs
// @desc     GET labs of particular student
// @access   Private Only access to student
router.get('/labs',passport.authenticate('jwt',{ session: false }), async (req, res) => {
    let labs = await Lab.find();

    let results = labs.filter(l => l.students.includes(req.user._id));

    res.send({error: false, results});
});



module.exports = router;