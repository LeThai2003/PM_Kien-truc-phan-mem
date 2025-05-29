const express = require("express");
const {authenticateToken} = require("../middlewares/authenticate.middleware");
const SearchController = require("../controllers/search.controller");

const router = express.Router();

router.use(authenticateToken);

router.post("/all-members/:projectId", SearchController.searchMembersInProject);

router.post("/add-member/:projectId", SearchController.searchAddMemberToProject);

router.post("/anything", SearchController.searchAnything);

module.exports = router;