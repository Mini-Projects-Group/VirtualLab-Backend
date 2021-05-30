const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (sender, receiver) => {
  let html = `<a href="https://virtual-lab-pict.netlify.app/reset-password?email=${(email =
    receiver)}"> Click Here to Reset Password </a>`;

  const msg = {
    to: receiver,
    from: sender,
    subject: "Password Reset",
    html,
  };

  // console.log(msg);
  try {
    let mail = sgMail.send(msg);
  } catch (e) {
    console.error(e);
    if (e.response) {
      console.error(e.response.body);
    }
  }
};

module.exports = sendMail;
