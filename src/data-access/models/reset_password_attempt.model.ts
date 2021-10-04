/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';
import { AppUser, AppUserModel } from './app_user.model';
import { PortalUser, PortalUserModel } from './portal_user.model';

export class ResetPasswordAttemptModel extends Model {
  static get tableName() {
    return 'reset_password_attempts'
  };

  static get idColumn() {
    return 'reset_password_attempt_id'
  };

  static relationMappings = {
    appUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: AppUserModel,
      join: {
        from: 'reset_password_attempts.app_user_id',
        to: 'app_users.app_user_id'
      }
    },
    portalUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: PortalUserModel,
      join: {
        from: 'reset_password_attempts.app_user_id',
        to: 'portal_users.portal_user_id'
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['guid'],
      properties: {
        resetPasswordAttemptId: { type: 'integer' },
        giud: { type: 'string' },
        appUserId: { type: 'integer' },
        portalUserId: { type: 'integer' },
        used: { type: 'boolean' },
      }
    }
  }

  public resetPasswordAttemptId?: number;
  public guid!: string;
  public appUserId?: number;
  public appUser?: AppUser;
  public portalUserId?: number;
  public portalUser?: PortalUser;
  public used?: boolean;
}

export type ResetPasswordAttempt = ModelObject<ResetPasswordAttemptModel>;