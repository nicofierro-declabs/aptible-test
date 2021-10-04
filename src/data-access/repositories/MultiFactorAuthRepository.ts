import { Service } from 'typedi';
import { MultiFactorAuth, MultiFactorAuthModel } from '../models/multi_factor_auth.model';
import { MultiFactorAuthBackupCodesModel } from "../models/multi_factor_auth_backup_codes.model";
import { BaseRepository } from "./BaseRepository";
import { MultiFactorAuthBackupCodesRepository } from "./MultiFactorAuthBackupCodesRepository";

@Service()
export class MultiFactorAuthRepository extends BaseRepository<MultiFactorAuthModel> {
  private multiFactorAuthBackupCodesRepository = new MultiFactorAuthBackupCodesRepository(MultiFactorAuthBackupCodesModel);

  /**
   * 
   * @param userId 
   * @returns MulfiFactorAuth object for a given user.
   */
  findByUserId = async (userId: number): Promise<MultiFactorAuthModel> => {
    const mfaSettings = await MultiFactorAuthModel.query().findOne('portalUserId', '=', userId);
    return mfaSettings;
  } 
  
  /**
   * 
   * @param userId 
   * @param mfaSettings 
   * @returns Updates and returns the MFA Settings.
   */
  storeAuthenticatorAuthMethod = async (mfaSettings: Partial<MultiFactorAuth>) => {
    const trx = await MultiFactorAuthModel.startTransaction();
    const settings = await this.upsert(mfaSettings as MultiFactorAuthModel, 'portalUserId' ,trx);
    trx.commit();
    return settings;
  }

  /**
   * 
   * @param userId 
   * @param updatedSettings 
   * @param settingsId
   * Calls the methods to update the MFA Settings, then create the backup codes.
   */
  validateAuthenticator = async(userId: number, updatedSettings: Partial<MultiFactorAuth>, settingsId: number) => {
    const trx = await MultiFactorAuthModel.startTransaction();
    try {
      await this.patch(updatedSettings as MultiFactorAuthModel, settingsId, trx);
      await this.multiFactorAuthBackupCodesRepository.createBackupCodes(userId, updatedSettings.secret!, trx);
      trx.commit();
    } catch (error) {
      trx.rollback();
      throw new Error(error);
    }
  }
}