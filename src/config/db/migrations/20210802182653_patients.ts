import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('patients', (table) => {
        table.increments('patient_id');
        table.string('first_name');
        table.string('last_name');
        table.date('date_of_birth');
        table.string('sex');
        table.integer('height');
        table.integer('weight');
        table.string('race');
        table.string('ethnicity');
        table.string('street_address');
        table.string('city');
        table.string('state');
        table.string('mobile_phone');
        table.string('email');
        table.integer('zip_code');
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('patients');
    return Promise.resolve();
}

