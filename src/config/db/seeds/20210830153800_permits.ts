import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    // await knex("permissions").del();

    // Inserts seed entries

    const result = await knex("permissions").whereIn("permission_id", [1, 2, 3, 4, 5, 6, 7]);
    if (result.length == 0)
        await knex("permissions").insert([
            {
                permission_id: 1, permission: "VIEW_PATIENT", name: "View patients",
                description: "View patient basic information",
            },
            {
                permission_id: 2, permission: "VIEW_PATIENT-HEALTH", name: "View patient health detail",
                description: "View health information about patients",
            },
            {
                permission_id: 3, permission: "ADD_PATIENT", name: "Create new patients",
                description: "Create new patients and link to your patient list",
            },
            {
                permission_id: 4, permission: "ADD_PRACTICE", name: "Create new practices",
                description: "Create new practices for the portal",
            },
            {
                permission_id: 5, permission: "VIEW_PRATICE", name: "View practices",
                description: "View all the practices in the portal",
            },
            {
                permission_id: 6, permission: "ADD_PRACTICE-ADMIN", name: "Create practice admin",
                description: "Create practice admin for the portal",
            },
            {
                permission_id: 7, permission: "ADD_USER", name: "Create users for your practice",
                description: "Create users for your practice to attend patients",
            },
        ]);
};

/*
    Actions: VIEW-ADD
    Entities: USER-PATIENT-PRACTICE

    Code -- Name -- Description
    VIEW_PATIENT - View patients - View patient basic information
    VIEW_PATIENT-HEALTH - View patient health detail - View health information about patients
    ADD_PATIENT - Create new patients - Create new patients and link to your patient list
    ADD_PRACTICE - Create new practices - Create new practices for the portal
    VIEW_PRACTICE - View practices - View all the practices in the portal
    ADD_PRACTICE-ADMIN - Create practice admin - Create practice admin for the portal
    ADD_USER - Create users for your practice - Create users for your practice to attend patients
*/