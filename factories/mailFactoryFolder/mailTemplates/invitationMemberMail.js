class InvitationMemberMail{
  constructor({senderName, projectName, recipientEmail, token}){
    this.recipient = recipientEmail;
    this.subject = "[PROJECT MANAGEMENT WEBSITE] Group invitation";
    this.content = `
      <p>Hi</p>
      <p>You are invited to participate in <strong>${projectName}</strong> on Project Management Website by <Strong><i>${senderName}</i></Strong></p>
      <p>Please click on the link included below to join</p>
      <a href="http://localhost:3000/project/invite/confirm?token=${token}">Accept to participate</a>
      <p><i>Note: Invitation will expire in <strong>7 days</strong></i></p>
    `;
  }

  getMail() {
    return {to: this.recipient, subject: this.subject, content: this.content};
  }
}

module.exports = InvitationMemberMail;