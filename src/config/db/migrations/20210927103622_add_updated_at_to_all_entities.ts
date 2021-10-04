import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  const tables = ['app_users', 'invitations', 'patients', 'permissions', 'portal_users', 'practices', 'system_roles', 'users_permissions'];
    tables.map(async (table) => {
      await knex.schema.table(table, (t) => {
        t.specificType('created_at', 'timestamptz(0)').notNullable().defaultTo(knex.fn.now());
        t.specificType('updated_at', 'timestamptz(0)');
        t.specificType('deleted_at', 'timestamptz(0)');
      })
      await knex.raw(
        `CREATE TRIGGER update_${table}_updated_at_column BEFORE UPDATE
        ON ${table} FOR EACH ROW EXECUTE PROCEDURE
        update_updated_at_column();`
      );
    });
  Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
  const tables = ['app_users', 'invitations', 'patients', 'permissions', 'portal_users', 'practices', 'system_roles', 'users_permissions'];
  tables.map(async (table) => {
    await knex.schema.table(table, (t) => {
      t.dropColumn('created_at');
      t.dropColumn('updated_at');
      t.dropColumn('deleted_at');
    });
    await knex.raw(`DROP TRIGGER update_${table}_updated_at_column ON ${table}`)
  });
  Promise.resolve();
}

