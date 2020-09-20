
exports.up = knex => knex.schema.createTable("users",table=>{
    table.increments('id').primary();
    table.string('username',50).unique();
    table.string('password',200);
})

exports.down = knex =>knex.schema.dropTable('users');