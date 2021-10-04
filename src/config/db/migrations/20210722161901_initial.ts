import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.increments('user_id');
        table.string('email').unique();
        table.string('password');
    })
    return Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
    return Promise.resolve();
}

