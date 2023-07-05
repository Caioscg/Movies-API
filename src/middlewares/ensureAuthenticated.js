const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization // local do token do user

    if(!authHeader) {
        throw new AppError("JWT Token não informado", 401)
    }

    const [, token] = authHeader.split(" ")  // token em no formato 'Bearer xxxxxx' -> estou separando a string em um vetor no " ", e desconsiderando o Bearer (n importa) 

    try {
        const { sub: user_id } = verify(token, authConfig.jwt.secret)  //* pega o conteudo 'sub' e nomeia de 'user_id'

        req.user = {  //* insere o id dentro da req do user
            id: Number(user_id)
        }

        return next()
    } catch {
        throw new AppError("JWT Token inválido", 401)
    }
}

module.exports = ensureAuthenticated