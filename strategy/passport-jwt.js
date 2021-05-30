const passport = require("passport");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
const Admin = require("../models/admin");
const Faculty = require('../models/faculty');
const Student = require('../models/student');

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      let user = "";
      console.log(payload);
      if (payload.userType == "admin")
        user = await Admin.findById(payload._id);
      else if(payload.userType == "faculty")
        user = await Faculty.findById(payload._id);
      else
        user = await Student.findById(payload._id);
      if (user) done(null, payload);
      else done(true, null);
    }
  )
);
