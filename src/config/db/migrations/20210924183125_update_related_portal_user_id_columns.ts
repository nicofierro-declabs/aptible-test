import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users_permissions', (table) => {
    table.renameColumn('user_id', 'portal_user_id');
  })
  await knex.schema.table('multi_factor_auth', (table) => {
    table.renameColumn('user_id', 'portal_user_id');
  })
  await knex.schema.table('multi_factor_auth_backup_codes', (table) => {
    table.renameColumn('user_id', 'portal_user_id');
  })
  await knex.schema.table('patients', (table) => {
    table.renameColumn('user_id', 'portal_user_id');
  })
  Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users_permissions', (table) => {
    table.renameColumn('portal_user_id', 'user_id');
  })
  await knex.schema.table('multi_factor_auth', (table) => {
    table.renameColumn('portal_user_id', 'user_id');
  })
  await knex.schema.table('multi_factor_auth_backup_codes', (table) => {
    table.renameColumn('portal_user_id', 'user_id');
  })
  await knex.schema.table('patients', (table) => {
    table.renameColumn('portal_user_id', 'user_id');
  })
  Promise.resolve();
}

