const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/uploads")

const UsersControllers = require("../controller/UserController")
const UsersAvatarControllers = require("../controller/UserAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const UserController = new UsersControllers()
const UserAvatarController = new UsersAvatarControllers()

const upload = multer(uploadConfig.MULTER) // para criar o arquivo

const usersRoutes = Router()

usersRoutes.post("/", UserController.create)
usersRoutes.put("/", ensureAuthenticated, UserController.update)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), UserAvatarController.update) // patch para atualizar so a imagem, que nao sera guardado no database, onde terá apenas a referencia para a pasta onde estará armazenada

module.exports = usersRoutes