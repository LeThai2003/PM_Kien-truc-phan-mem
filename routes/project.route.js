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


module.exports = router;