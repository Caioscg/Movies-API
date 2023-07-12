const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class UsersControllers {
    async create(req, res) {
        const { name, email, password } = req.body

        if (!name) {
            throw new AppError("O nome é obrigatório!")
        }
        if (!email) {
            throw new AppError("O e-mail é obrigatório!")
        }
        if (!password) {
            throw new AppError("A senha é obrigatória!")
        }
        
        const [ checkUserExists ] = await knex("users").where({ email }) //desestruturação

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso!")
        }

        const hashedPassword = await hash(password, 8)

        await knex("users").insert({name, email, password: hashedPassword})

        return res.status(201).json()
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body
        const user_id = req.user.id  // criado no ensureAuthenticated (nao precisa mais passar nos params)
                                    // em todas as notas que passam pelo middleware, muda e pega o user_id dessa forma
        const [ user ] = await knex("users").where({ id: user_id })

        if (!user) {
            throw new AppError("Usuário não encontrado!")
        }

        if (email) {
            const [ userWithUpdatedEmail ] = await knex("users").where({ email })
                
            if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
                throw new AppError("Este e-mail já está em uso!")
            }
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

            if (password == old_password) {
                throw new AppError("As duas senhas são iguais!")
            }

            user.password = await hash(password, 8)
        }

        await knex("users")
        .where({ id: user_id })
        .update({
            name,
            email,
            password: user.password
        })

        return res.status(200).json()

    }

}

module.exports = UsersControllers