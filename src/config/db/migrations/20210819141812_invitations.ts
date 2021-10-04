import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('invitations', (table) => {
        table.increments('invitation_id');
        table.string('invite_guid');
        table.enu('state', ['pending', 'expired', 'accepted']).notNullable().defaultTo('pending');
        table.integer('number_code');
        table.dateTime('expired_at');
        table.integer('host_user_id');
        table.integer('invite_user_id');
        table.jsonb('user_form');
        table.foreign('host_user_id').references('user_id').inTable('users');
        table.foreign('invite_user_id').references('user_id').inTable('users');
    })
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('invitations');
    return Promise.resolve();
}

