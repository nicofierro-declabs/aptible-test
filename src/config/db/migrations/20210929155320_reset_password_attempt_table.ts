import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reset_password_attempts', (table) => {
    table.increments('reset_password_attempt_id');
    table.string('guid');
    table.integer('app_user_id').nullable();
    table.integer('portal_user_id').nullable()
    table.boolean('used').defaultTo(false);
    table.specificType('created_at', 'timestamptz(0)').notNullable().defaultTo(knex.fn.now());
    table.specificType('updated_at', 'timestamptz(0)');
    table.specificType('deleted_at', 'timestamptz(0)');
    table.foreign('app_user_id').references('app_user_id').inTable('app_users');
    table.foreign('portal_user_id').references('portal_user_id').inTable('portal_users');
  }).then(() => knex.raw(
    `CREATE TRIGGER update_reset_password_attempts_updated_at_column BEFORE UPDATE
    ON reset_password_attempts FOR EACH ROW EXECUTE PROCEDURE
    update_updated_at_column();`
  ));
  Promise.resolve();
};

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('reset_password_attempt');
  Promise.resolve();
};