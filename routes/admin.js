const router = require('express').Router();
const passport = require('passport');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../utils/multer');
const readCSV = require('../utils/csv');

// @route    POST /api/admin/create
// @desc     create a dummy admin
// @access   Private Only access to admin

router.post('/create', async (req, res) => {
    let adminPresent = await Admin.findOne({ username: req.body.username});
    if(adminPresent)
        return res.send({error: true, message: 'User already present'});

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    let admin = new Admin({ username: req.body.username, password: hashedPassword});
    await admin.save();
    return res.send({error: false, message: 'Admin has been created'});
});

// @route    POST /api/admin/login
// @desc     admin login
// @access   Private Only access to admin

router.post('/login', async(req, res) => {
    let admin = await Admin.findOne({ username: req.body.username});
    if(!admin)
        return res.send({error: true, message: 'Incorrect Username'});

    if(!bcrypt.compareSync(req.body.password,admin.password))
        return res.send({error: true, message: 'Incorrect Password'});
    const { password, ...doc } = admin._doc;
    
    const token = jwt.sign({...doc, userType: 'admin'}, process.env.JWT_SECRET, { expiresIn: 7 * 24 * 60 * 60 * 1000 });
    return res.send({error: false, message: 'Login Successful', token});
});


// @route    POST /api/admin/new/students/file
// @desc     Add student data with the help of csv
// @access   Private Only access to admin
// 
router.post('/new/students/file', async (req, res) => {
    upload.single('file')(req, res, async err => {
        if(err) return res.send({error: true, message: 'File cannot be uploaded'});
        
        readCSV(req.file.originalname);
        return res.send({error: false, message: 'Student data added'});
    });
});


module.exports = router;