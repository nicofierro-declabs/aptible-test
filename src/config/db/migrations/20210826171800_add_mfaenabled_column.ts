import * as Knex from "knex";
import { addColumnToTable, dropColumnTable } from '../../../helpers/knex.helper';

export async function up(knex: Knex): Promise<void> {
  await addColumnToTable(knex, 'users', 'mfa_enabled', 'boolean', 'false');
  return Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
  await dropColumnTable(knex, 'users', 'mfa_enabled');
  return Promise.resolve();
}