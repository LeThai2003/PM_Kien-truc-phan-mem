const {convertToSlug} = require("../utils/convertToSlug");
const projectRepo = require("../repositories/project.repository");
const userRepo = require("../repositories/user.repository");
const {createError} = require("../utils/createError");
const tokenFactory = require("../factories/tokenFactory");
const mailFactory = require("../factories/mailFactory");

const createProject = async ({projectName, description, startDate, endDate, userId}) => {
  const slugName = convertToSlug(projectName);

  const newProject = await projectRepo.createProject({
    name: projectName,
    slugName,
    description,
    startDate,
    endDate,
    authorUserId: userId
  });

  const fullProject = await projectRepo.findById(newProject._id);
  return fullProject;
}

const updateProject = async ({projectId, projectName, description, startDate, endDate, userId}) => {
  const project = await projectRepo.findById(projectId);

  if(!project.authorUserId._id.equals(userId))
  {
    throw createError(400, "You couldn't change the information of this project");
  }

  const slugName = convertToSlug(projectName);

  await projectRepo.updateProject(projectId, {
    name: projectName,
    slugName,
    description,
    startDate,
    endDate
  });

  return await projectRepo.findById(projectId);
}

const getAllProjectsByUser = async (userId) => {
  return await projectRepo.findAllByUser(userId);
}

const addMember = async ({projectId, memberId, userId}) => {
  const member = await userRepo.findById(memberId);
  if(!member) throw createError(404, "Not find member");

  const project = await projectRepo.findById(projectId);
  if(!project.authorUserId._id.equals(userId)) throw createError(400, "You couldn't add member to project");

  if(project.authorUserId._id.equals(memberId) || project.membersId.some(member => member._id.equals(memberId)) || project.invitations.some(inv => inv.email == member.email))
  {
    throw createError(400, "User is not valid");
  }
  
  const tokenInvite = tokenFactory.generateToken("member", {email: member.email, memberId, type: "invite", projectId}); 

  await projectRepo.pushInvitation(projectId, {email: member.email, token: tokenInvite});

  await mailFactory.sendProjectInvitation({userId, project, memberEmail: member.email, token: tokenInvite});
}

const confirmInvite = async (token) => {
  try {
    const decoded = tokenFactory.verifyToken("member", token);
    const { email, memberId, projectId, type } = decoded;

    if(type !== "invite") throw createError(400, "Invalid token type");

    const project = await projectRepo.findById(decoded.projectId);

    if(project.authorUserId._id.equals(memberId) || project.membersId?.some(member => member._id.equals(memberId)) || !project.invitations?.some(inv => inv.email == email))
    {
      throw createError(400, "User is not valid");
    }

    await projectRepo.confirmMember(projectId, memberId, email);

    const member = await userRepo.findById(memberId);

    //  ------------ notication here ------------
    
    //  --------- end notication here -----------

    return { project, member };

  } catch (error) {
    throw createError(400, error.name + ": " + error.message);
  }
}



module.exports = {
  createProject,
  updateProject,
  getAllProjectsByUser,
  addMember,
  confirmInvite,
}