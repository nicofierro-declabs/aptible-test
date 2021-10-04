import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('permits', (table) => {
        table.increments('permission_id');
        table.string('permission');
    })
    await knex.schema.createTable('users_permits', (table) => {
        table.increments('user_permission_id');
        table.integer('user_id');
        table.integer('permission_id');
        table.foreign('user_id').references('user_id').inTable('users');
        table.foreign('permission_id').references('permission_id').inTable('permits');
    })
    Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('permits');
    await knex.schema.dropTable('users_permits');
}