import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users_patients');
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.createTable('users_patients', (table) => {
        table.increments('user_patient_id');
        table.integer('user_id');
        table.foreign('user_id').references('user_id').inTable('users');
        table.integer('patient_id');
        table.foreign('patient_id').references('patient_id').inTable('patients');
    })
    return Promise.resolve();
}

