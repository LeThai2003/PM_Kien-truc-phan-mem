const projectRepo = require("../repositories/project.repository");
const taskRepo = require("../repositories/task.repository");
const userRepo = require("../repositories/user.repository");
const {createError} = require("../utils/createError");
const {convertToSlug} = require("../utils/convertToSlug");

const TaskService = {
  createTask: async (data, userId) => {
    const {projectId, title, assigneeUserId} = data;
    const project = await projectRepo.findById(projectId);
    const memberIds = [project.authorUserId._id, ...(project.membersId || []).map(m => m._id.toString())];

    if(!memberIds.some(id => id.equals(userId))) throw createError(400, "Unauthorized to create task");

    const task = await taskRepo.create({
      ...data,
      slugTitle: convertToSlug(title),
      authorUserId: userId,
      assigneeUserId: assigneeUserId || null
    });

    const infoTask = await taskRepo.findById(task._doc._id);
    const relatedUserNotify = memberIds.filter(id => id !== userId);
    const infoUser = await userRepo.findById(userId);

    // --------notication for user relatied-----
    // -------end notication for user relatied------

    // ---------socket here: user related + new task-----------
    // ----------end socket-----------

    return infoTask;
  },

  getAllTask: async (projectId, userId) => {
    const project = await projectRepo.findById(projectId);
    const isMember = project.authorUserId._id.equals(userId) || project.membersId?.some(m => m._id.equals(userId));
    if(!isMember) throw createError(400, "Unauthorized to view tasks");
    return taskRepo.findAllByProject(projectId);
  },

  updateTaskStatus: async (taskId, toStatus, userId) => {
    const task = await taskRepo.findById(taskId);
    if(!task.authorUserId._id.equals(userId) && !task.assigneeUserId?._id.equals(userId))
    {
      throw createError(400, "Unauthorized to update task");
    }

    if(task.sub_tasks?.length > 0)
    {
      task.sub_tasks = task.sub_tasks.map(sub => ({
        ...sub.toObject(),
        isChecked: ["Under View", "Completed"].includes(toStatus) ? true :
          ["To Do"].includes(toStatus) ||
          (["Under View", "Completed"].includes(task.status) && ["To Do", "Work In Progress"].includes(toStatus)) ? false : sub.isChecked
      }));
    }

    task.status = toStatus;
    const updatedTask = await taskRepo.updateById(task._id, task);

    // --------notication for user relatied-----
    // -------end notication for user relatied------

    // ---------socket here: drag and drop-----------
    // ----------end socket-----------    

    return updatedTask;
  },

  updateTask: async (taskId, data, userId) => {
    const task = await taskRepo.findById(taskId);
    if(!task.authorUserId._id.equals(userId) && !task.assigneeUserId?._id.equals(userId))
    {
      throw createError(400, "Unauthorized to update task");
    }
    if(data.assigneeUserId == "") data.assigneeUserId = null;

    let subTasks = data.sub_tasks || [];

    if(subTasks.length > 0)
      data.sub_tasks = subTasks.map(sub => ({
        ...sub,
        isChecked: ["Under View", "Completed"].includes(data.status) ? true :
          ["To Do"].includes(data.status) ||
          (["Under View", "Completed"].includes(task.status) && ["To Do", "Work In Progress"].includes(data.status)) ? false : sub.isChecked
      }));

    const updatedTask = await taskRepo.updateById(taskId, data);

    // ---------socket here: update task-----------
    // ----------end socket-----------

    return updatedTask;

  }

}


module.exports = TaskService;