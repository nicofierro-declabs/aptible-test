import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('permits', (table) => {
        table.string('name');
        table.string('description');
    }); 
    return Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('permits', (table) => {
        table.dropColumns('name');
        table.dropColumn('description');
    });
    return Promise.resolve();
}