import * as Knex from 'knex';

export const up = async (knex: Knex) => {
  async function createTriggerUpdatedAt() {
    return knex.raw(
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
  		RETURNS TRIGGER AS $$
  		BEGIN
  			NEW.updated_at = CURRENT_TIMESTAMP;
  			RETURN NEW;
  		END;
      $$ language 'plpgsql';
  		`
    );
  }
  await createTriggerUpdatedAt();
}

export const down = async (knex: Knex) => {
  return knex.raw(`
      DROP TRIGGER IF EXISTS update_updated_at_column;
    `);
}