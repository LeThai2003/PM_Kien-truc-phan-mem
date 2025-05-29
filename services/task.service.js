const projectRepo = require("../repositories/project.repository");
const taskRepo = require("../repositories/task.repository");
const userRepo = require("../repositories/user.repository");
const notificationRepo = require("../repositories/notification.repository");
const {createError} = require("../utils/createError");
const {convertToSlug} = require("../utils/convertToSlug");

const TaskService = {
  createTask: async (data, userId) => {
    const {projectId, title, assigneeUserId} = data;
    const project = await projectRepo.findById(projectId);
    const memberIds = [project.authorUserId._id, ...(project.membersId || []).map(m => m._id)];

    if(!memberIds.some(id => id.equals(userId))) throw createError(400, "Unauthorized to create task");

    const task = await taskRepo.create({
      ...data,
      slugTitle: convertToSlug(title),
      authorUserId: userId,
      assigneeUserId: assigneeUserId || null
    });

    const infoTask = await taskRepo.findById(task._doc._id);
    const relatedUserNotify = memberIds.filter(id => !id.equals(userId));
    const infoUser = await userRepo.findById(userId);

    // --------notication for user relatied-----
    if(relatedUserNotify.length > 0)
    {
      for (const uid of relatedUserNotify) {
        await notificationRepo.createAndSave(
          type = "task",
          data = { user: infoUser, task, project, targetUserId: uid }
        )
      }
    }
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
        ...sub,
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
  },

  getTaskDetail: async (taskId, userId) => {
    const task = await taskRepo.findById(taskId);
    const project = await projectRepo.findById(task.projectId);
    const isMember = project.authorUserId._id.equals(userId) || project.membersId?.some(m => m._id.equals(userId));
    if(!isMember) throw createError(400, "Unauthorized to view task");
    return task;
  },

  updateCompeletedSubTask: async (listCheck, taskId, userId) => {
    const task = await taskRepo.findById(taskId);
    if(!task.authorUserId._id.equals(userId) && !task.assigneeUserId?._id.equals(userId)){
      throw createError(400, "Unauthorized to update task");
    }

    let updateTask;

    if(listCheck?.length > 0){
      if(listCheck.includes("completed")){
        if(task.sub_tasks.length > 0) throw createError(400, "Fail!!!");
        updateTask = await taskRepo.updateById(taskId, {status: "Under View"});
      } else {
        let subTasks = task.sub_tasks.toObject();
        subTasks = subTasks.map(sub => listCheck.includes(sub._id.toString()) ? {...sub, isChecked: true} : {...sub, isChecked: false})
        let status = listCheck.length == task.sub_tasks.length ? "Under View" : "Work In Progress";
        updateTask = await taskRepo.updateById(taskId, {status, sub_tasks: subTasks});
      }
    } else {
      let subTasks = task.sub_tasks.toObject() || [];
      subTasks.length > 0 && (subTasks = subTasks.map(sub => ({...sub, isChecked: false})) || []);
      updateTask = await taskRepo.updateById(taskId, {status: "To Do", sub_tasks: subTasks});
    }

    return updateTask;
  },

  getDataChart: async (userId) => {
    const tasks = await taskRepo.findAllByUserId(userId);
    let data = [];
    let arrayStatus = ["To Do", "Work In Progress", "Under View", "Completed"];

    if(tasks.length > 0){
      for (const status of arrayStatus) {
        const countRecord = tasks.filter(task => task.status == status)?.length || 0;
        data.push({
          status: status,
          count: countRecord
        })
      }
    }

    return data;
  },

  getTasksByPriority: async (userId, priority) => {
    const arrPriority = ['Backlog', 'Low', 'Medium', 'High', 'Urgent'];
    if(!arrPriority.includes(priority)) throw createError(400, "Priority is not valid");

    const projects = await projectRepo.findAllByUser(userId);
    const tasks = await taskRepo.findAllByUserId(userId, {priority});

    let dataResult = [];
    if(tasks.length > 0){
      for (const project of projects) {
        const tasksResult = tasks.filter(task => task.projectId.equals(project._id));
        if(tasksResult.length > 0){
          dataResult.push({
            project: {
              id: project._id,
              name: project.name
            },
            tasks: tasksResult
          })
        }
      }
    }

    return dataResult;
  },

  deleteTask: async (taskId, userId) => {
    const task = await taskRepo.findById(taskId);
    if(!task) throw createError(400, "Task not found");
    if(!task.authorUserId._id.equals(userId)) throw createError(400, "Unauthorized to delete task");
    // ---- delete notifications + socket for related user ----
    const notifications = await notificationRepo.findNotificationByTaskId(taskId);
    // if(notifications.length > 0){
    //   // socket here
    // }
    await notificationRepo.deleteByTaskId(taskId);
    // ---- end delete notifications ----
    await taskRepo.deleteById(taskId);
  }

}


module.exports = TaskService;