/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';

export class PermissionModel extends Model {

    static get tableName() {
        return 'permissions';
    }

    static get idColumn() {
        return 'permissionId'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['permission'],
            properties: {
                permissionId: { type: 'integer' },
                permission: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
            }
        }
    }

    public permissionId!: number | undefined;
    public permission?: string;
    public name?: string;
    public description?: string;
}

export type Permission = ModelObject<PermissionModel>;