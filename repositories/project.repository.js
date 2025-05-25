const Project = require("../models/project.model");

const createProject = async (data) => {
  const project = new Project(data);
  return await project.save();
};

const findById = async (projectId) => {
  return await Project.findById(projectId)
    .populate({path: "authorUserId", select: "-password -refreshToken"})
    .populate({path: "membersId", select: "-password -refreshToken"});
};

const updateProject = async (projectId, updateData) => {
  return await Project.updateOne({_id: projectId}, updateData);
};

const findAllByUser = async (userId) => {
  return await Project.find({
    $or: [
      { authorUserId: userId},
      { membersId: userId},
    ]
  })
    .populate({path: "authorUserId", select: "-password -refreshToken"})
    .populate({path: "membersId", select: "-password -refreshToken"});
};

const pushInvitation = async (projectId, invitation) => {
  return await Project.updateOne({_id: projectId}, {
    $push: { invitations: invitation}
  });
};

const confirmMember = async (projectId, memberId, email) => {
  return await Project.updateOne({_id: projectId}, {
    $push: { membersId: memberId},
    $pull: { invitations: {email}},
  });
};

module.exports = {
  createProject,
  findById,
  updateProject,
  findAllByUser,
  pushInvitation,
  confirmMember
}