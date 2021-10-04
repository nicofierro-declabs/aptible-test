import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('patients', (table) => {
        table.string('height').alter();
        table.string('weight').alter();
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('patients', (table) => {
        table.integer('height').alter();
        table.integer('weight').alter();
    })
    return Promise.resolve();
}

