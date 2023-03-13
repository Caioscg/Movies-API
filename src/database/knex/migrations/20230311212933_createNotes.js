//TODO arq criado com 'npx knex migrate:make createNotes' (precisa do migrations criado corretamente no knexfile)
//! cria tabelas de forma automatizada
exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments("id")
    table.text("title")     
    table.text("description") 
    table.integer("rating")
    table.integer("user_id").references("id").inTable("users")

    table.timestamp("create_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("notes")


//TODO 'npx knex migrate:latest' para criar a table
//TODO após criar o atalho no package.json é só rodar npm run migrate