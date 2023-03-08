const AppError = require("../utils/AppError")

class UsersControllers {
    create(req, res) {
        const { name, email, password } = req.body

        if (!name) {
            throw new AppError("O nome é obrigatório!")
        }

        res.status(201).json({ name, email, password })
    }
}

module.exports = UsersControllers