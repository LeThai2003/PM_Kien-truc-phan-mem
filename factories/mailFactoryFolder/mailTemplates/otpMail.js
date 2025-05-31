class OtpPasswordMail {
  constructor({ email, otp }) {
    this.recipient = email;
    this.subject = `[PROJECT MANAGEMENT WEBSITE] OTP Forgot Password`;
    this.content = `Your OTP code is <b style="color:red;">${otp}</b> <br> Please do not share with anyone. <br> <i>The code expires in 5 minutes</i>`;
  }

  getMail() {
    return { to: this.recipient, subject: this.subject, content: this.content };
  }
}

module.exports = OtpPasswordMail;