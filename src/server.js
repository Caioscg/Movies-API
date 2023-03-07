/* 
    npm init -y
    npm install express --save
    npm install nodemon --save-dev
*/

const express = require("express")

const app = express()

app.use(express.json())

app.post("/users", (req, res) => {
    const { name, email, password } = req.body

    res.send({ name, email, password })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))