const mongoose = require("mongoose");
const projectService = require("../services/project.service");

module.exports.create = async (req, res, next) => {
  try {
    const data = await projectService.createProject({
      projectName: req.body.projectName,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      userId: req.userId,
    });

    res.status(200).json({ message: "Create project success", project: data });
  } catch (error) {
    next(error);
  }
}

module.exports.update = async (req, res, next) => {
  try {
    const data = await projectService.updateProject({
      projectId: req.body.projectId,
      projectName: req.body.projectName,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    res.status(200).json({ message: "Update project success", project: data });
  } catch (error) {
    next(error);
  }
}