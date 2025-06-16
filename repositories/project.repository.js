const Project = require("../models/project.model");

const createProject = async (data) => {
  const project = new Project(data);
  return await project.save();
};

const findById = async (projectId) => {
  return await Project.findById(projectId)
    .populate({path: "authorUserId", select: "-password -refreshToken -createdAt -updatedAt"})
    .populate({path: "membersId", select: "-password -refreshToken -createdAt -updatedAt"});
};

const updateProject = async (projectId, updateData) => {
  return await Project.updateOne({_id: projectId}, updateData);
};

const findAllByUser = async (userId, filter = {}) => {
  return await Project.find({
    $and: [
      {
        $or: [
          { authorUserId: userId},
          { membersId: userId},
        ]
      },
      filter
    ]
  })
    .populate({path: "authorUserId", select: "-password -refreshToken -createdAt -updatedAt"})
    .populate({path: "membersId", select: "-password -refreshToken -createdAt -updatedAt"});
};

const pushInvitation = async (projectId, invitation) => {
  return await Project.updateOne({_id: projectId}, {
    $push: { invitations: invitation}
  });
};

const pullInvitation = async (projectId, email) => {
  return await Project.updateOne({_id: projectId}, {
    $pull: { invitations: {email}}
  });
};

const confirmMember = async (projectId, memberId, email) => {
  return await Project.findByIdAndUpdate(projectId, {
    $push: { membersId: memberId},
    $pull: { invitations: {email}},
  })
    .populate({path: "authorUserId", select: "-password -refreshToken -createdAt -updatedAt"})
    .populate({path: "membersId", select: "-password -refreshToken -createdAt -updatedAt"})
    .select("-invitations");
};

const deleteProject = async (projectId) => {
  return await Project.deleteOne({_id: projectId});
};



module.exports = {
  createProject,
  findById,
  updateProject,
  findAllByUser,
  pushInvitation,
  pullInvitation,
  confirmMember,
  deleteProject
}