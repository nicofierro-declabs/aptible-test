/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';
import { AppUser, AppUserModel } from './app_user.model';
import { PortalUser, PortalUserModel } from './portal_user.model';

export class PatientModel extends Model {

    static get tableName() {
        return 'patients';
    }

    static get idColumn() {
        return 'patientId'
    }

    static relationMappings = {
        portalUser: {
            relation: Model.BelongsToOneRelation,
            modelClass: PortalUserModel,
            join: {
                from: 'patients.portal_user_id',
                to: 'portal_users.portal_user_id'
            }
        },
        appUser: {
            relation: Model.BelongsToOneRelation,
            modelClass: AppUserModel,
            join: {
                from: 'patients.app_user_id',
                to: 'app_users.app_user_id'
            }
        }
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                patientId: { type: 'integer' },
                userId: { type: 'integer' },
                appUserId: { type: 'integer' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                dateOfBirth: { type: 'string' },
                sex: { type: 'string' },
                height: { type: 'string' },
                weight: { type: 'string' },
                race: { type: 'string' },
                ethnicity: { type: 'string' },
                streetAddress: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                mobilePhone: { type: 'string' },
                email: { type: 'string' }
            }
        }
    }

    public patientId!: number | undefined;
    public firstName!: string;
    public lastName!: string;
    public dateOfBirth!: Date;
    public sex!: string;
    public height!: string;
    public weight!: string;
    public race!: string;
    public ethnicity!: string;
    public streetAddress!: string;
    public city!: string;
    public state!: string;
    public zipCode!: string;
    public mobilePhone!: string;
    public email!: string;
    public portalUserId?: number | undefined;
    public portalUser?: PortalUser | undefined;
    public appUserId?: number | undefined;
    public appUser?: AppUser | undefined;
}

export type Patient = ModelObject<PatientModel>;