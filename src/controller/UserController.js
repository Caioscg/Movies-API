const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class UsersControllers {
    async create(req, res) {
        const { name, email, password } = req.body

        if (!name) {
            throw new AppError("O nome é obrigatório!")
        }

        const checkUserExists = await knex("users").where({ email })

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso!")
        }

        const hashedPassword = await hash(password, 8)

        await knex("users").insert({name, email, password: hashedPassword})

        res.status(201).json()
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body
        const { id } = req.params

        const user = await knex("users").where({ id })

        if (!user) {
            throw new AppError("Usuário não encontrado!")
        }

        const userWithUpdatedEmail = await knex("users").where({ email })

        if (userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
            throw new AppError("Este e-mail já está em uso!")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha!")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere!")
            }

            user.password = await hash(password, 8)
        }

        await knex("users")

    }

}

module.exports = UsersControllers