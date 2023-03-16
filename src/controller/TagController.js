const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class TagsController {
    async index(req, res) {
        const { user_id } = req.params

        const [ user ] = await knex("users").where({ id: user_id })

        if (!user) {
            throw new AppError("Usuário não encontrado!")
        }

        const tags = await knex("tags").where({ user_id })

        return res.json(tags)
    }
}

module.exports = TagsController