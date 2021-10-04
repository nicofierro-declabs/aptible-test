import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('patients', (table) => {
        table.string('zip_code').alter();
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('patients', (table) => {
        table.integer('zip_code').alter();
    })
    return Promise.resolve();
}

