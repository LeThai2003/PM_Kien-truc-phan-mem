const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const {authenticateToken} = require("../middlewares/authenticate.middleware");

router.use(authenticateToken);

router.post("/create", projectController.create);

router.patch("/update", projectController.update);


module.exports = router;