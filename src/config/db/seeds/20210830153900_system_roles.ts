import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    // await knex("system_roles").del();

    // Inserts seed entries
    const result = await knex("system_roles").whereIn("system_role_id", [1, 2, 3]);
    if (result.length == 0)
        await knex("system_roles").insert([
            { system_role_id: 1, name: "Super admin" },
            { system_role_id: 2, name: "Practice admin" },
            { system_role_id: 3, name: "Practice user" },
        ]).whereNotExists(knex('system_roles').where('system_role_id', 1).where('system_role_id', 2).where('system_role_id', 3));
};