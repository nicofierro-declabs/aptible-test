/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';
import { MultiFactorAuthModel, MultiFactorAuth } from './multi_factor_auth.model';
import { Permission, PermissionModel } from './permission.model';
import { Practice, PracticeModel } from './practice.model';
import { SystemRole, SystemRoleModel } from './system_role.model';

export class PortalUserModel extends Model {

    static get tableName() {
        return 'portal_users';
    }

    static get idColumn() {
        return 'portalUserId'
    }

    static relationMappings = {
        permissions: {
            relation: Model.ManyToManyRelation,
            modelClass: PermissionModel,
            join: {
                from: 'portal_users.portal_user_id',
                through: {
                    from: 'users_permissions.portal_user_id',
                    to: 'users_permissions.permission_id'
                },
                to: 'permissions.permission_id'
            }
        },
        practice: {
            relation: Model.BelongsToOneRelation,
            modelClass: PracticeModel,
            join: {
                from: 'portal_users.practice_id',
                to: 'practices.practice_id'
            }
        },
        systemRole: {
            relation: Model.BelongsToOneRelation,
            modelClass: SystemRoleModel,
            join: {
                from: 'portal_users.system_role_id',
                to: 'system_roles.system_role_id'
            }
        },
        mfaSettings: {
            relation: Model.BelongsToOneRelation,
            modelClass: MultiFactorAuthModel,
            join: {
                from: 'portal_users.portal_user_id',
                to: 'multi_factor_auth.portal_user_id'
            }
        },
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                portalUserId: { type: 'integer' },
                email: { type: 'string', minLength: 1 },
                password: { type: 'string', minLength: 1 },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                mobilePhone: { type: 'string' },
                officePhone: { type: 'string' },
                mfaEnabled: { type: 'boolean' },
            }
        }
    }

    public portalUserId!: number | undefined;
    public email!: string;
    public password?: string | undefined;
    public firstName!: string;
    public lastName!: string;
    public mobilePhone?: string | undefined;
    public officePhone?: string | undefined;
    public mfaEnabled?: boolean;
    public permissions?: Array<Permission>;
    public practiceId?: number | undefined;
    public practice?: Practice | undefined;
    public systemRoleId!: number;
    public systemRole?: SystemRole | undefined;
    public role?: string | undefined;
    public npi?: string | undefined;
    public speciality?: string | undefined;
    public prefix?: string | undefined;
    public mfaSettings?: MultiFactorAuth | undefined;

}

export type PortalUser = ModelObject<PortalUserModel>;