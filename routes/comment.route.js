const express = require("express");
const {authenticateToken} = require("../middlewares/authenticate.middleware");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

router.use(authenticateToken);

router.post("/:taskId", commentController.create);

router.get("/:taskId", commentController.getAll);

router.patch("/:id", commentController.updateComment);

router.delete("/:id", commentController.deleteComment);

router.patch("/like/:id", commentController.updateLike);

module.exports = router;