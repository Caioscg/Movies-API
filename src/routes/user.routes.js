const { Router } = require("express")

const UsersControllers = require("../controller/UserController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const UserController = new UsersControllers()

const usersRoutes = Router()

usersRoutes.post("/", UserController.create)
usersRoutes.put("/", ensureAuthenticated, UserController.update)

module.exports = usersRoutes