import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('portal_users', (table) => {
    table.renameColumn('user_id', 'portal_user_id');
  })
  Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('portal_users', (table) => {
    table.renameColumn('portal_user_id', 'user_id');
  })
  Promise.resolve();
}