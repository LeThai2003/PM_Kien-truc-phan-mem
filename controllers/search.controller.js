const SearchService = require("../services/search.service");

// [POST] /search/all-members/:projectId
module.exports.searchMembersInProject = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
}

// [POST] /search/add-member/:projectId
module.exports.searchAddMemberToProject = async (req, res, next) => {
  try {
    const {projectId} = req.params;
    const userId = req.userId;
    const {search} = req.body;
    const result = await SearchService.seachUserToAdd(projectId, userId, search);
    return res.status(200).json({message: "Get users successfully", users: result})
  } catch (error) {
    next(error);
  }
}

// [POST] /search/anything
module.exports.searchAnything = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {search} = req.body;
    const {projects, tasks, users} = await SearchService.searchAnything(userId, search);
    return res.status(200).json({message: "Search successfully", projects, tasks, users});
  } catch (error) {
    next(error);
  }
}