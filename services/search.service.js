const { createError } = require("../utils/createError");
const ProjectRepo = require("../repositories/project.repository");
const UserRepo = require("../repositories/user.repository");
const TaskRepo = require("../repositories/task.repository");
const {convertToSlug} = require("../utils/convertToSlug");

const SearchService = {
  seachUserToAdd: async (projectId, userId, searchKey) => {
    if("@gmail.com".includes(searchKey)) throw createError(400, "Please enter a valid email");
    const project = await ProjectRepo.findById(projectId);
    if(!project.authorUserId._id.equals(userId)) throw createError(400, "Unauthorized to add memmber");

    const slugSearch = convertToSlug(searchKey);

    let users = await UserRepo.findUserBySearch(searchKey, slugSearch);
    let result = [];
    for (const user of users) {
      const u = user.toObject();
      project.authorUserId._id.equals(u._id) ? u.status = "Creator"
        : project.membersId?.some(m => m._id.equals(u._id)) ? u.status = "Member"
        : project.invitations?.some(inv => inv.email === u.email) ? u.status = "Inviting"
        : u.status = "User"
      result.push(u);
    }

    return result;
  },

  searchAnything: async (userId, searchKey) => {
    const slugSearch = convertToSlug(searchKey);

    const projects = await ProjectRepo.findAllByUser(
      userId, 
      {
        $or: [
          { slugName: {$regex: slugSearch}},
          { description: {$regex: searchKey, $options: "i"}}
        ]
      }
    )

    const tasks = await TaskRepo.findAllByUserId(
      userId,
      {
        $or: [
          { slugTitle: {$regex: slugSearch}},
          { description: {$regex: searchKey, $options: "i"}},
          { status: {$regex: searchKey, $options: "i"}},
          { priority: {$regex: searchKey, $options: "i"}},
        ]
      }
    )

    const users = await UserRepo.findUserBySearch(searchKey, slugSearch);

    return {projects, tasks, users};
  }
}

module.exports = SearchService;