var SibApiV3Sdk = require("sib-api-v3-sdk");
const forgotPasswordRequest = require("../models/ForgotPasswordRequest");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const sequelize = require("../util/sqlconfig");

const apiKey =
  "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";

exports.forgotpasswordData = async (req, res, next) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const email = req.body.email;

    

    const user = await User.findOne({ where: { email: email } });
    if (user) {
       const forpasswordrequest = await forgotPasswordRequest.create(
        { UserId: user.id, isactive: true }
      );

      console.log(forpasswordrequest.id)

      const apiKeyInstance = defaultClient.authentications["api-key"];
        apiKeyInstance.apiKey = apiKey;
        const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


      // Configure the email
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.sender = { email: "your@email.com", name: "Your Name" };
      sendSmtpEmail.subject = "Password Recovery";
      sendSmtpEmail.htmlContent = `<a href="http://localhost:3000/password/resetpassword/${forpasswordrequest.id} "> click here to reset password</a>`; // Replace with your email content

      // Send the email
      await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);

      console.log("Recovery email sent successfully");
      res.status(200).json({ message: "Recovery email sent successfully" });
    } else {
      // Handle the case when the user with the provided email does not exist.
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(
      "Error sending recovery email:",
      err.response ? err.response.text : err.message
    );
    res.status(500).json({ message: "Error sending recovery email" });
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
      const forPasswordRequest = await forgotPasswordRequest.findOne({ where: { id: req.params.uuid } });

      if (!forPasswordRequest) {
          return res.status(401).json({ message: 'Invalid reset link' });
      }

      // Redirect the user to the password reset form with the UUID as a query parameter
      res.redirect(`http://127.0.0.1:5500/front-end/resetpassword/resetpassword.html?uuid=${req.params.uuid}`);

      // Set isactive to false after the link is used
      await forPasswordRequest.update({ isactive: false });
  } catch (err) {
      console.error('Error in resetpassword route:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
}


exports.newpassword = async(req, res, next) =>{
  let t;
    try{
      const password = req.body.password
      const uuid =req.body.uuid;
      const hashedPassword = await bcrypt.hash(password, 10);
      const forpassaword = await forgotPasswordRequest.findOne({where: {id: uuid}})
      console.log(forpassaword.UserId);
      const userId = forpassaword.UserId;
      t = await sequelize.transaction()
      const updatedUser =await User.update({password: hashedPassword}, {where: {id: userId}}, {transaction: t})
      console.log(updatedUser)
    }catch(err){
      t.rollback()
      console.log(err)
    }
}

