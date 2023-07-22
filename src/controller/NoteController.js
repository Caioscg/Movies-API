const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const { json } = require("express")

class NotesController {
    async create(req, res) {
        const { title, description, rating, tags } = req.body
        const user_id = req.user.id

        const [note_id] = await knex("notes").insert({
            title,
            description,
            rating,
            user_id
        })

        if (tags.length > 0) {
            const tagsInsert = tags.map(name => {
                return {
                    note_id,
                    name,
                    user_id
                }
            })
    
            await knex("tags").insert(tagsInsert)
        }

        return res.json()
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
        const { title } = req.query
        const user_id = req.user.id

        const notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)  //* achar ao pesquisar qualquer palavra do title (pesquisa na query do insomnia)
        .orderBy("title") //* ordem alfabética

        const userTags = await knex("tags").where({ user_id })
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }
        })

        return res.json(notesWithTags)

    }
}

module.exports = NotesController