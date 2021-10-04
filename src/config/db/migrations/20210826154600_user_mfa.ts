import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('multi_factor_auth', (table) => {
    table.increments('id');
    table.integer('user_id').unique();
    table.foreign('user_id').references('user_id').inTable('users');
    table.enu('method', ['sms', 'authenticator']).notNullable().defaultTo('authenticator');
    table.string('phone_number');
    table.string('secret');
    table.string('temp_secret');
    table.string('otpauth_url');
    table.specificType('created_at', 'timestamptz(0)').notNullable().defaultTo(knex.fn.now());
    table.specificType('updated_at', 'timestamptz(0)');
    table.specificType('deleted_at', 'timestamptz(0)');
  }).then(() => knex.raw(
      `CREATE TRIGGER update_multifactorauth_updated_at_column BEFORE UPDATE
      ON multi_factor_auth FOR EACH ROW EXECUTE PROCEDURE
      update_updated_at_column();`
  ));
  
  await knex.schema.createTable('multi_factor_auth_backup', (table) => {
    table.increments('id');
    table.integer('user_id');
    table.foreign('user_id').references('user_id').inTable('users');
    table.string('token');
    table.string('phone_number');
    table.specificType('created_at', 'timestamptz(0)').notNullable().defaultTo(knex.fn.now());
    table.specificType('updated_at', 'timestamptz(0)');
    table.specificType('deleted_at', 'timestamptz(0)');
  }).then(() => knex.raw(
      `CREATE TRIGGER update_multifactorauth_backup_updated_at_column BEFORE UPDATE
          ON multi_factor_auth_backup FOR EACH ROW EXECUTE PROCEDURE
          update_updated_at_column();`
    ))
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('multi_factor_auth');
  await knex.schema.dropTable('multi_factor_auth_backup');
  return Promise.resolve();
}