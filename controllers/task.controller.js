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

// [GET] /task/:taskId
module.exports.taskDetail = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {taskId} = req.params;
    const task = await taskService.getTaskDetail(taskId, userId);
    res.status(200).json({ message: "Getted task", task });
  } catch (error) {
    next(error);
  }
}

// [PATCH] /task/update-completed/:taskId
module.exports.updateCompleted = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {taskId} = req.params;
    const {listCheck} = req.body;
    const updatedTask = await taskService.updateCompeletedSubTask(listCheck, taskId, userId);
    res.status(200).json({ message: "Updated complete task", task: updatedTask });
  } catch (error) {
    next(error);
  }
}

// [GET] /task/data/chart
module.exports.dataChart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const dataChart = await taskService.getDataChart(userId);
    return res.status(200).json({message: "Get data tasks for chart successfully", data: dataChart, total: dataChart?.length || 0});
  } catch (error) {
    next(error);
  }
}

// [GET] /task/priority/:priority
module.exports.tasksPriority = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {priority} = req.params;
    const dataResult = await taskService.getTasksByPriority(userId, priority);
    return res.status(200).json({message: "Get tasks priority successfully", dataPriorityTasks: dataResult});
  } catch (error) {
    next(error);
  }
}

// [DELETE] /task/delete/:taskId
module.exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {taskId} = req.params;
    const dataResult = await taskService.deleteTask(taskId, userId);
    return res.status(200).json({message: "Delete task successfully"});
  } catch (error) {
    next(error);
  }
}