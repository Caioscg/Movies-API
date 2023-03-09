const { hash } = require("bcryptjs")
const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const sqliteConnection = require("../database/sqlite")

class UsersControllers {
    async create(req, res) {
        const { name, email, password } = req.body

        if (!name) {
            throw new AppError("O nome é obrigatório!")
        }

        const database = await sqliteConnection()
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso!")
        }

        const hashedPassword = await hash(password, 8)

        await knex("users").insert({name, email, password: hashedPassword})

        res.status(201).json()
    }
}

module.exports = UsersControllers