import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.renameTable('permits', 'permissions');
    await knex.schema.renameTable('users_permits', 'users_permissions');
    return Promise.resolve();    
}


export async function down(knex: Knex): Promise<void> {
}

