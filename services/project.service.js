const {convertToSlug} = require("../utils/convertToSlug");
const projectRepo = require("../repositories/project.repository");
const userRepo = require("../repositories/user.repository");
const taskRepo = require("../repositories/task.repository");
const notificationRepo = require("../repositories/notification.repository");
const {createError} = require("../utils/createError");
const tokenFactory = require("../factories/tokenFactory");
const mailService = require("./mail.service");
const eventBus = require("../events/eventBus");
const EVENT_TYPES = require("../events/eventType");

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
  
  const tokenInvite = tokenFactory.generateToken("member", {email: member.email, memberId, typeEmail: "invite", projectId}); 

  await projectRepo.pushInvitation(projectId, {email: member.email, token: tokenInvite});

  await mailService.sendProjectInvitation({userId, project, memberEmail: member.email, token: tokenInvite});
}

const removeMemberInv = async ({projectId, memberId, userId}) => {
  const member = await userRepo.findById(memberId);
  if(!member) throw createError(404, "Not find member");

  const project = await projectRepo.findById(projectId);
  if(!project.authorUserId._id.equals(userId)) throw createError(400, "You couldn't remove member invited in project");

  if(project.authorUserId._id.equals(memberId) || project.membersId.some(member => member._id.equals(memberId)) || !project.invitations.some(inv => inv.email == member.email))
  {
    throw createError(400, "User is not valid");
  }
  
  await projectRepo.pullInvitation(projectId, email = member.email);
}

const confirmInvite = async (token) => {
  try {
    const decoded = tokenFactory.verifyToken("member", token);
    const { email, memberId, projectId, typeEmail } = decoded;

    if(typeEmail !== "invite") throw createError(400, "Invalid token type");

    const project = await projectRepo.findById(decoded.projectId);

    if(project.authorUserId._id.equals(memberId) || project.membersId?.some(member => member._id.equals(memberId)) || !project.invitations?.some(inv => inv.email == email))
    {
      throw createError(400, "User is not valid");
    }
    
    const member = await userRepo.findById(memberId);
    
    const projectUpdate = await projectRepo.confirmMember(projectId, memberId, email);

    //  ------------ notication here ------------
    const notification = await notificationRepo.createAndSave(
      type = "member",
      data = { member, project: projectUpdate}
    )

    eventBus.emit(EVENT_TYPES.MEMBER.NEW, { project: projectUpdate, member });

    eventBus.emit(EVENT_TYPES.NOTIFICATION.NEW_MEMBER, { notification })
    //  --------- end notication here -----------

    
    return { project, member };

  } catch (error) {
    throw createError(400, error.name + ": " + error.message);
  }
}

const getChartData = async (userId) => {
  const projects = await projectRepo.findAllByUser(userId);
  const projectIds = projects?.map(p => p._id) || [];
  
  let data = [];

  if(projects.length == 0) return data = [];

  const tasks = await taskRepo.findAllByProjectsAndFields(
    projectIds, 
    {status: { $in: ["To Do", "Work In Progress", "Under Review"] }}
  );

  const projectIdsWithUncompletedTasks = new Set(tasks.map(t => t.projectId.toString()));

  let countUnCompleted = projectIdsWithUncompletedTasks.size;
  let countCompleted = projects.length - countUnCompleted;

  data = [
    {
      type: "Completed",
      percent: projects.length > 0 ? Math.round(countCompleted / projects.length * 100) : 0
    },
    {
      type: "UnCompleted",
      percent: projects.length > 0 ? Math.round(countUnCompleted / projects.length * 100) : 0
    }
  ];

  return data;
}

const getPercentCompeleted = async (userId) => {
  const projects = await projectRepo.findAllByUser(userId);
  const projectIds = projects?.map(p => p._id) || [];

  const tasks = await taskRepo.findAllByProjectsAndFields(
    projectIds, 
  );

  const scoreMap = {
    "To Do": 1,
    "Work In Progress": 2,
    "Under Review": 3,
    "Completed": 4
  };

  const taskGroups = {};
  for (const task of tasks) {
    const key = task.projectId.toString();
    if(!taskGroups[key]) taskGroups[key] = [];
    taskGroups[key].push(task);
  }

  const result = projects.map(project => {
    const pid = project._id.toString();
    const projectTasks = taskGroups[pid] || [];
    if(projectTasks.length == 0){
      return {
        projectId: project._id,
        percent: 100
      };
    }

    const totalScore = projectTasks.length * 4;
    const actualScore = projectTasks.reduce((sum, task) => {
      return sum + (scoreMap[task.status] || 0);
    }, 0);

    return {
      projectId: project._id,
      percent: Math.round(actualScore / totalScore * 100)
    };
  });

  return result;
}


module.exports = {
  createProject,
  updateProject,
  getAllProjectsByUser,
  addMember,
  removeMemberInv,
  confirmInvite,
  getChartData,
  getPercentCompeleted
}