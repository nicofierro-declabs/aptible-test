import * as Knex from "knex";
import { hashPassword } from "../../../helpers/crypto.helper";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    const result = await knex("portal_users").where("email", "admin@decemberlabs.com");
    if (result.length == 0)
        await knex("portal_users").insert([
            {
                email: 'admin@decemberlabs.com',
                password: hashPassword('Admin1234*'),
                firstName: 'Administrator',
                lastName: 'Administrator',
                mobilePhone: '123456789',
                officePhone: '123456789',
                practiceId: null,
                systemRoleId: 1,
            }
        ])
};
