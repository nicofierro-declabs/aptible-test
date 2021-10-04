/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';
import { PortalUser, PortalUserModel } from './portal_user.model';

export class InvitationModel extends Model {

    static get tableName() {
        return 'invitations';
    }

    static get idColumn() {
        return 'invitationId'
    }

    static relationMappings = {
        hostUser: {
            relation: Model.BelongsToOneRelation,
            modelClass: PortalUserModel,
            join: {
                from: 'invitations.host_user_id',
                to: 'portal_users.portal_user_id'
            }
        },
        inviteUser: {
            relation: Model.BelongsToOneRelation,
            modelClass: PortalUserModel,
            join: {
                from: 'invitations.invite_user_id',
                to: 'portal_users.portal_user_id'
            }
        }
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                invitationId: { type: 'integer' },
                inviteGuid: { type: 'string' },
                state: { type: 'string' },
                numberCode: { type: 'integer' },
                expiredAt: { type: 'string' },
                userForm: { type: 'string' }
            }
        }
    }

    public invitationId!: number | undefined;
    public inviteGuid!: string;
    public state!: 'pending' | 'expired' | 'accepted';
    public numberCode!: number;
    public expiredAt!: string;
    public userForm!: string;
    public hostUserId!: number;
    public hostUser?: PortalUser;
    public inviteUserId?: number;
    public inviteUser?: PortalUser;
}

export type Invitation = ModelObject<InvitationModel>;