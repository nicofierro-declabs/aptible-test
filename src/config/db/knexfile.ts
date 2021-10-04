import { Config } from 'knex';
import postgres from 'pg';
import path from 'path';
import { knexSnakeCaseMappers } from 'objection';
import env from '../config';

const dateParser = (value: string): string =>
  // Dates are fetched as strings and parsed to Date by default.
  // This prevents from being parsed to Date and keeps them as strings.
  value
  ;

postgres.types.setTypeParser(postgres.types.builtins.DATE, dateParser);
postgres.types.setTypeParser(postgres.types.builtins.TIME, dateParser);
postgres.types.setTypeParser(postgres.types.builtins.TIMESTAMP, dateParser);
postgres.types.setTypeParser(postgres.types.builtins.TIMESTAMPTZ, dateParser);

const { DB_HOST, DB_PASSWORD, DB_PORT } = env;

const config: Config = {
  client: 'postgresql',
  connection: {
    host: DB_HOST,
    port: +DB_PORT!,
    user: 'postgres',
    password: DB_PASSWORD,
    database: process.env.NODE_ENV == 'test' ? 'conneqt-test' : 'conneqt',
  },
  pool: { min: 0, max: 1000 },
  migrations: {
    directory: __dirname + '/migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  seeds: {
    directory: __dirname + '/seeds',
    extension: 'ts',
    stub: path.resolve(__dirname, 'src', 'config', 'db', 'seeds', 'seed.stub.txt'),
  },
  ...knexSnakeCaseMappers(),
};

export default config;