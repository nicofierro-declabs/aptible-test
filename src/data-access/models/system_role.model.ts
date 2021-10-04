/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';

export class SystemRoleModel extends Model {

    static get tableName() {
        return 'system_roles';
    }

    static get idColumn() {
        return 'systemRoleId'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                systemRoleId: { type: 'integer' },
                name: { type: 'string' },
            }
        }
    }

    public systemRoleId!: number | undefined;
    public name!: string;
}

export type SystemRole = ModelObject<SystemRoleModel>;