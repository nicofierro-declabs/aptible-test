import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.string('role');
        table.string('npi');
        table.string('speciality');
        table.string('prefix');
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.dropColumns('role', 'npi', 'speciality', 'prefix');
    })
    return Promise.resolve();
}

