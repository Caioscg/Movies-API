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
        const { user_id, title, tags } = req.query

        const [ notesExists ] = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)  //* achar ao pesquisar qualquer palavra do title (pesquisa na query do insomnia)
        .orderBy("title") //* ordem alfabética
        
        if (!notesExists) {
            throw new AppError("Nota não encontrada!")
        }
        
        let notes

        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())  // para unir as tags em um vetor separado por ','

            notes = await knex("tags")      //! quando eu pesquiso uma tag existente ele linka mostrando as informações da note
                .select([                                           //*? seleciona esses campos da table notes
                    "notes.id",
                    "notes.title",
                    "notes.user_id"
                ])
                .where("notes.user_id", user_id)                    //*? busca as notas do id de user passado no query
                .whereLike("notes.title", `%${title}%`)             //*? e dentro desse id, busca a note com o titulo digitado
                .whereIn("name", filterTags)                        //*? compara se o nome digitado pertence ao array
                .innerJoin("notes", "notes.id", "tags.note_id")     //*? estou juntando a tags com a notes por meio do notes_id
                .orderBy("notes.title")

        } else {
            notes = await knex("notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)  //* achar ao pesquisar qualquer palavra do title (pesquisa na query do insomnia)
            .orderBy("title") //* ordem alfabética
        }

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