
exports.up = knex => knex.schema.table('tasks',table=>{
    // table.foreign('user_id').references('id').inTable('users');
})

exports.down = knex =>knex.schema.table("users", table => {
    // table.dropForeign("user_id");
});