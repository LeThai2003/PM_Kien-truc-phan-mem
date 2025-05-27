const mongoose = require("mongoose");
const projectService = require("../services/project.service");

// [POST] /project/create
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

// [PATCH] /project/update
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


// [GET] /project/get-all
module.exports.getAll = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjectsByUser(req.userId);
    res.status(200).json({ message: "Fetched projects successfully", projects})
  } catch (error) {
    next(error);
  }
}

// [POST] /project/:id/add-member
module.exports.addMemberToProject = async (req, res, next) => {
  try {
    await projectService.addMember({
      projectId: req.params.id,
      memberId: req.body.memberId,
      userId: new mongoose.Types.ObjectId(req.userId)
    });

    res.status(200).json({ message: "Invited successfully" });
  } catch (error) {
    next(error);
  }
}

// [GET] /project/invite/confirm
module.exports.confirmInvite = async (req, res, next) => {
  try {
    console.log("------haha-----");
    const result = await projectService.confirmInvite(req.query.token);
    // ---socket notification member + add member to project---

    // ---end socket notification member + add member to project---
    console.log(result);

    res.render("project_confirm_member", {
      projectId: result.project._id
    });
  } catch (error) {
    next(error);
  }
}

// 