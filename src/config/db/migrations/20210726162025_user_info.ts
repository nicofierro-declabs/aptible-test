import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.string('first_name');
        table.string('last_name');
        table.string('mobile_phone').nullable();
        table.string('office_phone').nullable();
    })
    return Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.dropColumn('first_name');
        table.dropColumn('last_name');
        table.dropColumn('mobile_phone');
        table.dropColumn('office_phone');
    })
    return Promise.resolve();
}