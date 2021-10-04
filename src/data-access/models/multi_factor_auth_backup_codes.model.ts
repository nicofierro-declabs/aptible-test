import { Model, ModelObject } from "objection";

export class MultiFactorAuthBackupCodesModel extends Model {

  static get tableName() {
    return 'multi_factor_auth_backup_codes';
  }

  static get idColumn() {
    return 'id'
  }

  static relationMappings = {
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        id: { type: 'integer' },
        portalUserId: { type: 'integer' },
        token: { type: 'string' },
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: ['string', 'null'], format: 'date-time'},
        deletedAt: {type: ['string', 'null'], format: 'date-time'},
      }
    }
  }

  public id?: number;

  public portalUserId!: number;

  public token!: string;

  protected createdAt?: string;
  
  protected updatedAt?: string;

  protected deletedAt?: string;

}

export type MultiFactorAuthBackupCodes = ModelObject<MultiFactorAuthBackupCodesModel>;