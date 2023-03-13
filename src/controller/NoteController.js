const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const { json } = require("express")

class NotesController {
    async create(req, res) {
        const { title, description, rating, tags } = req.body
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

        const note_id = await knex("notes").insert({
            title,
            description,
            rating: Number(rating.toFixed(1)),
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        })

        await knex("tags").insert(tagsInsert)

        res.json()
    }

    async show(req, res) {
        const { id } = req.params

        const note = await knex("notes").where({ id }).first()
        const tags = await knex("tags").where({ note_id: id }).orderBy("name")

        if (!note) {
            throw new AppError("Nota não encontrada!")
        }

        return res.json({
            ...note,
            tags
        })
    }

    async delete(req, res) {
        const { id } = req.params

        await knex("notes").where({ id }).delete()

        return res.json()
    }

    async index(req, res) {

    }
}

module.exports = NotesController