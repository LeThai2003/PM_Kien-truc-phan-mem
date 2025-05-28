const express = require("express");
const TaskController = require("../controllers/task.controller");
const { authenticateToken } = require("../middlewares/authenticate.middleware");

const router = express.Router();

router.use(authenticateToken);

router.post("/create", TaskController.create);

router.get("/get-all", TaskController.getAll);

router.patch("/update-status", TaskController.updateStatus);

router.patch("/update/:taskId", TaskController.updateTask);

router.get("/:taskId", TaskController.taskDetail);

router.patch("/update-completed/:taskId", TaskController.updateCompleted);

router.get("/data/chart", TaskController.dataChart);

router.get("/priority/:priority", TaskController.tasksPriority);

router.delete("/delete/:taskId", TaskController.deleteTask);

module.exports = router;