const PORT = process.env.PORT || 5000;
require("dotenv").config({ path: ".env" });
require("./db/db");
require("./strategy/passport-jwt");
const express = require("express");
const cors = require("cors");

const app = express();
const passport = require("passport");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(passport.initialize());

app.use("/api/admin", require("./routes/admin"));
app.use("/api/user", require("./routes/clients"));
app.use('/api/labs', require('./routes/lab'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/student', require('./routes/student'));

app.use("/", (req, res) => res.send("Welcome to the API"));

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
