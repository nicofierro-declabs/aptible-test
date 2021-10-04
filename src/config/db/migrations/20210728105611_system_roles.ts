import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('system_roles', (table) => {
        table.increments('system_role_id');
        table.string('name').unique();
    })
    await knex.schema.table('users', (table) => {
        table.integer('system_role_id');
        table.foreign('system_role_id').references('system_role_id').inTable('system_roles');
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('system_roles');
    await knex.schema.table('users', (table) => {
        table.dropForeign(['system_role_id']);
        table.dropColumn('system_role_id');
    })
    return Promise.resolve();
}

