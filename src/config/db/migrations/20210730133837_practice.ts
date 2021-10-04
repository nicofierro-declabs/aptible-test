import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('practices', (table) => {
        table.increments('practice_id');
        table.string('npi');
        table.string('practice_type');
        table.string('address');
    });
    await knex.schema.table('users', (table) => {
        table.integer('practice_id');
        table.foreign('practice_id').references('practice_id').inTable('practices');
    });
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('practices');
    await knex.schema.table('users', (table) => {
        table.dropForeign(['practice_id']);
        table.dropColumn('practice_id');
    });
    return Promise.resolve();
}