const {sendMail} = require("../utils/sendMail");
const userRepo = require("../repositories/user.repository");

const MailFactory = {
  async sendProjectInvitation({userId, project, memberEmail, token}){
    const user = await userRepo.findById(userId);

    const subject = "[PROJECT MANAGEMENT WEBSITE] Group invitation";
    const content = `
      <p>Hi</p>
      <p>You are invited to participate in <strong>${project.name}</strong> on Project Management Website by <Strong><i>${user.fullname}</i></Strong></p>
      <p>Please click on the link included below to join</p>
      <a href="http://localhost:3000/project/invite/confirm?token=${token}">Accept to participate</a>
      <p><i>Note: Invitation will expire in <strong>10 minutes</strong></i></p>
    `;
    await sendMail(memberEmail, subject, content);
  },

  async sendOtpPassword({email, otp}){
    const subject = `[PROJECT MANAGEMENT WEBSITE] OTP Forgot Password`;
    const content = `Your otp code is <b style="color:red;">${otp}</b> <br> Please not share with anyone. <br> <i>The code expires in 5 minutes</i>`;
    await sendMail(email, subject, content);
  },
}


module.exports = MailFactory;