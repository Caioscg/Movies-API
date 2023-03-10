const { Router } = require("express")

const UsersControllers = require("../controller/UserController")

const UserController = new UsersControllers()

const usersRoutes = Router()

usersRoutes.post("/", UserController.create)
usersRoutes.put("/:id", UserController.update)

module.exports = usersRoutes