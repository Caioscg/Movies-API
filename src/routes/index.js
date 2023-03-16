const { Router } = require("express")

const userRoutes = require("./user.routes")
const noteRoutes = require("./notes.routes")
const tagRoutes = require("./tags.routes")

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/notes", noteRoutes)
routes.use("/tags", tagRoutes)

module.exports = routes