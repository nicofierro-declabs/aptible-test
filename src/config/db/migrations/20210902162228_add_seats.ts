import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('practices', (table) => {
        table.integer('seats').defaultTo(0);
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('practices', (table) => {
        table.dropColumn('seats');
    })
    return Promise.resolve();
}

