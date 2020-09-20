
exports.up = knex => knex.schema.createTable('tasks',table=>{
    table.increments('id').primary();
    table.string('name',100).notNullable();
    table.string('file_name').notNullable();
    table.string('tableName');
    table.integer('user_id').unsigned().nullable();
    table.integer('status').defaultTo(0);
})
exports.down = knex => knex.schema.dropTable('tasks')