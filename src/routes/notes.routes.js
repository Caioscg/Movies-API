const { Router } = require("express")

const NotesControllers = require("../controller/NoteController")

const NoteController = new NotesControllers()

const notesRoutes = Router()

notesRoutes.post("/:user_id", NoteController.create)

module.exports = notesRoutes