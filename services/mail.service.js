const UserRepo = require("../repositories/user.repository");
const MailFactory = require("../factories/mailFactoryFolder/mailFactory");
const {sendMail} = require("../utils/sendMail");

const MailService = {
  async sendProjectInvitation({userId, project, memberEmail, token}){
    const user = await UserRepo.findById(userId);
    const mail = MailFactory.createMail("member", {
      senderName: user.fullname,
      projectName: project.name,
      recipientEmail: memberEmail,
      token,
    });
    const {to, subject, content} = mail.getMail();
    await sendMail(to, subject, content);
  },

  async sendOtpPassword({ email, otp }) {
    const mail = MailFactory.createMail("otp", { email, otp });
    const { to, subject, content } = mail.getMail();
    await sendMail(to, subject, content);
  },
}

module.exports = MailService;