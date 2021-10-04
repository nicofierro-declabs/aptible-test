import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("patients", (table) => {
    table.integer("user_id");
    table.foreign("user_id").references("user_id").inTable("users");
    table.integer("app_user_id");
    table.foreign("app_user_id").references("app_user_id").inTable("app_users")
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("patients", (table) => {
    table.dropForeign(["user_id", "app_user_id"]);
    table.dropColumn("user_id");
    table.dropColumn("app_user_id");
  });
}
