const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class NotesController {
    async create(req, res) {
        const { title, description, rating } = req.body
        const { user_id } = req.params

        const [ user ] = await knex("users").where({ id: user_id })
        
        if (!user) {
            throw new AppError("Usuário não encontrado!")
        }

        if (!title) {
            throw new AppError("Título é obrigatório!")
        }

        if (rating && rating < 0 || rating > 5) {
            throw new AppError("A nota deve estar entre 0 e 5.")
        }

        await knex("notes").insert({
            title,
            description,
            rating: Number(rating.toFixed(1)),
            user_id
        })

        res.json()
    }
}

module.exports = NotesController