const InvitationMemberMail = require("./mailTemplates/InvitationMemberMail");
const OtpPasswordMail = require("./mailTemplates/otpMail");


class MailFactory {
  static createMail(type, data){
    switch(type){
      case "member": 
        return new InvitationMemberMail(data);
      case "otp":
        return new OtpPasswordMail(data);
      default:
        throw new Error("Invalid mail type");
    }
  }
}

module.exports = MailFactory;