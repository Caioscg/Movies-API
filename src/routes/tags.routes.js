const { Router } = require("express")

const TagsControllers = require("../controller/TagController")

const TagController = new TagsControllers()

const tagsRoutes = Router()

tagsRoutes.get("/:user_id", TagController.index)

module.exports = tagsRoutes