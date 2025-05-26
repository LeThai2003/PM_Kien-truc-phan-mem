const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {type: String, required: true},
  slugName: {type: String},
  description: {type: String},
  startDate: {type: Date},
  endDate: {type: Date},
  authorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  membersId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  invitations: [{
    email: {type: String, required: true},
    invitedAt: {type: Date, default: Date.now},
    token: {type: String, required: true},
    expireAt: { type: Date, default: Date.now, expires: 7 * 24 * 3600}
  }]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;