const taskService = require("../services/task.service");

// [POST] /task/create
module.exports.create = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.userId);
    res.status(200).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
}

// [GET] /task/get-all
module.exports.getAll = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTask(req.query.projectId, req.userId);
    return res.status(200).json({message: "Tasks retrieved", tasks});
  } catch (error) {
    next(error);
  }
}

// [PATCH] /task/update-status
module.exports.updateStatus = async (req, res, next) => {
  try {
    const updatedTask = await taskService.updateTaskStatus(req.body.taskId, req.body.toStatus, req.userId);
    res.status(200).json({ message: "Task status updated", task: updatedTask });
  } catch (error) {
    next(error);
  }
}

// [PATCH] /task/update/:taskId
module.exports.updateTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {taskId} = req.params;
    const data = req.body;
    const updatedTask = await taskService.updateTask(taskId, data, userId);
    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    next(error);
  }
}