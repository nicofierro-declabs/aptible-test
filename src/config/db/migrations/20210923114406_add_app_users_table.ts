import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('app_users', (table) => {
    table.increments('app_user_id');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('mobile_phone');
    table.string('date_of_birth');
    table.string('sex');
    table.string('height');
    table.string('weight');
    table.json('settings');
  })
  return Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('app_users');
  return Promise.resolve();
}

