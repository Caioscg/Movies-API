/* 
    npm init -y
    npm install express --save
    npm install nodemon --save-dev
    npm install express-async-errors --save
    npm install sqlite3 sqlite --save
    npm install knex --save
    npx knex init
    npm install bcryptjs
*/

require("express-async-errors")
const AppError = require("./utils/AppError")

const database = require("./database/sqlite")

const express = require("express")

const routes = require("./routes")

database()

const app = express()

app.use(express.json())

app.use(routes)

app.use(( error, req, res, next ) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))