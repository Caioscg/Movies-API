const { Router } = require("express")

const NotesControllers = require("../controller/NoteController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const NoteController = new NotesControllers()

const notesRoutes = Router()

notesRoutes.use(ensureAuthenticated)  // como para todas as rotas tem q passar pelo middleware, ja usa antes pra tudo

notesRoutes.post("/", NoteController.create)
notesRoutes.get("/:id", NoteController.show)
notesRoutes.delete("/:id", NoteController.delete)
notesRoutes.get("/", NoteController.index)

module.exports = notesRoutes