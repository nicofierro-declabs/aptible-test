import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  async function createTriggerCreatedAt() {
    return knex.raw(
      `CREATE OR REPLACE FUNCTION update_created_at_column()
  		RETURNS TRIGGER AS $$
  		BEGIN
  			NEW.created_at = CURRENT_TIMESTAMP;
  			RETURN NEW;
  		END;
      $$ language 'plpgsql';
  		`
    );
  }
  await createTriggerCreatedAt();
  const tables = ['app_users', 'invitations', 'multi_factor_auth', 'multi_factor_auth_backup_codes', 'patients', 'permissions', 'portal_users', 'practices', 'system_roles', 'users_permissions'];
  tables.map(async (table) => {
    await knex.raw(
      `CREATE TRIGGER update_${table}_created_at_column BEFORE INSERT
      ON ${table} FOR EACH ROW EXECUTE PROCEDURE
      update_created_at_column();`
    );
  });
  Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
  const tables = ['app_users', 'invitations', 'multi_factor_auth', 'multi_factor_auth_backup_codes', 'patients', 'permissions', 'portal_users', 'practices', 'system_roles', 'users_permissions'];
  tables.map(async (table) => {
    await knex.raw(`DROP TRIGGER update_${table}_created_at_column ON ${table}`)
  });
  Promise.resolve();
}

