import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('users', 'portal_users');
  await knex.schema.renameTable('multi_factor_auth_backup', 'multi_factor_auth_backup_codes');
  Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('portal_users', 'users');
  await knex.schema.renameTable('multi_factor_auth_backup_codes', 'multi_factor_auth_backup');
  Promise.resolve();
}

