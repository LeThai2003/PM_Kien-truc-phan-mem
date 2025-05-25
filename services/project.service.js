const {convertToSlug} = require("../utils/convertToSlug");
const projectRepo = require("../repositories/project.repository");
const {createError} = require("../utils/createError");

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

  await projectRepo.updateProject(projectId, {
    name: projectName,
    description,
    startDate,
    endDate
  });

  return await projectRepo.findById(projectId);
}

const getAllProjectsByUser = async (userId) => {
  return await projectRepo.getAllProjectsByUser(userId);
}



module.exports = {
  createProject,
  updateProject,
  getAllProjectsByUser,
}