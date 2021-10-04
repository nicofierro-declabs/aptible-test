import * as Knex from 'knex';

export async function addColumnToTable(
  knex: Knex,
  tableName: string,
  columnName: string,
  columnType: string,
  defaultValue?: Knex.Value
) {
  return knex.schema
    .hasColumn(tableName, columnName)
    .then((exists) => {
      if (!exists) {
        if (defaultValue) {
          return knex.schema.table(tableName, (t) => {
            t.specificType(columnName, columnType).notNullable().defaultTo(defaultValue!);
          });
        }
        return knex.schema.table(tableName, (t) => {
          t.specificType(columnName, columnType);
        });
      }
      return null;
    });
}

export async function dropColumnTable(knex: Knex, tableName: string, columnName: string) {
  return knex.schema
    .hasColumn(tableName, columnName)
    .then((exists) => {
      if (exists) {
        return knex.schema.table(tableName, (t) => {
          t.dropColumn(columnName);
        });
      }
      return null;
    });
}

export async function alterColumnTable(
  knex: Knex,
  tableName: string,
  columnName: string,
  columnType: string,
  defaultValue?: string
) {
  return knex.schema
    .hasColumn(tableName, columnName)
    .then((exists) => {
      if (exists) {
        if (defaultValue) {
          return knex.schema.alterTable(tableName, (t) => {
            t.specificType(columnName, columnType).defaultTo(defaultValue).notNullable().alter();
          });
        } 
          return knex.schema.alterTable(tableName, (t) => {
            t.specificType(columnName, columnType).notNullable().alter();
          });
        
      }
      return null;
    });
}

export async function renameColumnTable(
  knex: Knex,
  tableName: string,
  oldColumnName: string,
  newColumnName: string
) {
  return knex.schema
    .hasColumn(tableName, oldColumnName)
    .then((exists) => {
      if (exists) {
        return knex.schema.table(tableName, (t) => {
          t.renameColumn(oldColumnName, newColumnName);
        });
      }
      return null;
    });
}

export async function addFKToTable(
  knex: Knex,
  fkTable: string,
  fkColumn: string,
  referencedSchema: string,
  referencedTable: string,
  referencedColumn: string,
  onUpdate?: string,
  onDelete?: string
) {
  return knex.schema
    .withSchema(referencedSchema)
    .hasColumn(referencedTable, referencedColumn)
    .then((exists) => {
      if (exists) {
        return knex.schema.table(fkTable, (t) => {
          t.foreign(fkColumn)
            .references(referencedColumn)
            .inTable(`${referencedSchema  }.${  referencedTable}`)
            .onUpdate(onUpdate || 'NO ACTION')
            .onDelete(onDelete || 'NO ACTION');
        });
      }
      return null;
    });
}

export async function dropFKTable(knex: Knex, tableName: string, fkColumn: string) {
  return knex.schema.table(tableName, (t) => {
    t.dropForeign([fkColumn]);
  });
}
