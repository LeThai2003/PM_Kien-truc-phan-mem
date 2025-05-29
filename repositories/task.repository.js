const Task = require("../models/task.model");

const TaskRepository = {
  create: async (data) => {
    const task = new Task(data);
    await task.save();
    return task;
  },

  findById: async (id) => {
    return await Task.findById(id)
      .populate("authorUserId", "-password -refreshToken -createdAt -updatedAt")
      .populate("assigneeUserId", "-password -refreshToken -createdAt -updatedAt");
  },

  findAllByProject: async (projectId) => {
    return await Task.find({projectId})
      .populate("authorUserId", "-password -refreshToken -createdAt -updatedAt")
      .populate("assigneeUserId", "-password -refreshToken -createdAt -updatedAt");
  },

  findAllByProjectsAndFields: async (projectIds, filter = {}) => {
    return await Task.find({
      $and: [
        { projectId: { $in : projectIds}},
        filter
      ]
    })
      .populate("authorUserId", "-password -refreshToken -createdAt -updatedAt")
      .populate("assigneeUserId", "-password -refreshToken -createdAt -updatedAt");
  },

  findAllByUserId: async (userId, filter = {}) => {
    return await Task.find({
      $and: [
        {
          $or: [
            {authorUserId: userId},
            {assigneeUserId: userId}
          ]
        },
        filter
      ]
    })
      .populate("authorUserId", "-password -refreshToken -createdAt -updatedAt")
      .populate("assigneeUserId", "-password -refreshToken -createdAt -updatedAt");
  },

  updateById: async (id, data) => {
    const updatedTask = await Task.findByIdAndUpdate(id, data, { new: true })
      .populate("authorUserId", "-password -refreshToken -createdAt -updatedAt")
      .populate("assigneeUserId", "-password -refreshToken -createdAt -updatedAt");
    return updatedTask;
  },

  deleteById: async (id) => {
    await Task.findByIdAndDelete(id);
  }
}

module.exports = TaskRepository