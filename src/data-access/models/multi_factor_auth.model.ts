import { Model, ModelObject } from "objection";
import { MultiFactorAuthBackupCodes, MultiFactorAuthBackupCodesModel } from "./multi_factor_auth_backup_codes.model";

export class MultiFactorAuthModel extends Model {

  static get tableName() {
    return 'multi_factor_auth';
  }

  static get idColumn() {
    return 'id'
  }

  static relationMappings = {
    backupCodes: {
      relation: Model.HasManyRelation,
      modelClass: MultiFactorAuthBackupCodesModel,
      join: {
        from: 'multi_factor_auth.portal_user_id',
        to: 'multi_factor_auth_backup_codes.portal_user_id'
      }
    }
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        id: { type: 'integer' },
        portalUserId: { type: 'integer' },
        method: { type: 'string' },
        phoneNumber: { type: ['string', 'null'] },
        secret: { type: ['string', 'null'] },
        tempSecret: { type: ['string', 'null'] },
        otpauthUrl: { type: 'string' },
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: ['string', 'null'], format: 'date-time'},
        deletedAt: {type: ['string', 'null'], format: 'date-time'},
      }
    }
  }

  public id?: number;

  public portalUserId!: number;

  public method!: string;

  public phoneNumber?: string;

  public secret?: string;

  public tempSecret?: string | null;

  public otpauthUrl?: string;

  public backupCodes?: MultiFactorAuthBackupCodes[];
  
  protected createdAt?: string;
  
  protected updatedAt?: string;

  protected deletedAt?: string;

}

export type MultiFactorAuth = ModelObject<MultiFactorAuthModel>;