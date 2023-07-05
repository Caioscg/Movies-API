const { Router } = require("express")

const TagsControllers = require("../controller/TagController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const TagController = new TagsControllers()

const tagsRoutes = Router()

tagsRoutes.get("/", ensureAuthenticated, TagController.index)

module.exports = tagsRoutes