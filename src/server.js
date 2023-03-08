/* 
    npm init -y
    npm install express --save
    npm install nodemon --save-dev
    npm install express-async-errors --save
*/

require("express-async-errors")
const AppError = require("./utils/AppError")

const express = require("express")

const app = express()

const routes = require("./routes")

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