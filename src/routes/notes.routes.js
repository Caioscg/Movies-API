const { Router } = require("express")

const NotesControllers = require("../controller/NoteController")

const NoteController = new NotesControllers()

const notesRoutes = Router()

notesRoutes.post("/:user_id", NoteController.create)
notesRoutes.get("/:id", NoteController.show)
notesRoutes.delete("/:id", NoteController.delete)
//notesRoutes.get("/", NoteController.delete)

module.exports = notesRoutes