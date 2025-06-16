const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const {authenticateToken} = require("../middlewares/authenticate.middleware");

router.get("/invite/confirm", projectController.confirmInvite);

router.use(authenticateToken);

router.post("/create", projectController.create);

router.patch("/update", projectController.update);

router.get("/get-all", projectController.getAll);

router.post("/:id/add-member", projectController.addMemberToProject);

router.post("/:id/remove-member-inviting", projectController.removeMemberInviting);

router.get("/data/chart", projectController.dataChart);

router.get("/get-percent-completed", projectController.percentCompleted);

router.delete("/delete/:projectId", projectController.deleteProject);


module.exports = router;