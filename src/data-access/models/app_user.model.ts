import { Model, ModelObject } from 'objection';

export class AppUserModel extends Model {
  static get tableName() {
    return 'app_users'
  };

  static get idColumn() {
    return 'app_user_id'
  };

  static relationMappings = {}

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        appUserId: { type: 'integer' },
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 1 },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        mobilePhone: { type: 'string' },
        dateOfBirth: { type: 'string' },
        sex: { type: 'string' },
        height: { type: 'string' },
        weight: { type: 'string' },
      }
    }
  }

  public appUserId?: number;

  public email!: string;

  public password?: string;

  public firstName!: string;

  public lastName!: string;

  public mobilePhone?: string;
  
  public dateOfBirth?: string;

  public sex?: string;

  public height?: string;

  public weight?: string;
}

export type AppUser = ModelObject<AppUserModel>;