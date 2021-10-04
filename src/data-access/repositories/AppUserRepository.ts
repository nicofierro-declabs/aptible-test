/* eslint-disable class-methods-use-this */
import { Service } from "typedi";
import { BaseError } from "../../utils/errors/BaseError";
import { AppUser, AppUserModel } from "../models/app_user.model";
import { ResetPasswordAttemptModel } from "../models/reset_password_attempt.model";
import { BaseRepository } from "./BaseRepository";
import { ResetPasswordAttemptRepository } from "./ResetPasswordAttemptRepository";

@Service()
export class AppUserRepository extends BaseRepository<AppUserModel> {
  private resetPasswordAttemptRepository = new ResetPasswordAttemptRepository(ResetPasswordAttemptModel);

  async existsUser(appUser: AppUser): Promise<boolean> {
    const user = await AppUserModel.query().findOne(
      "email",
      "=",
      appUser.email
    );
    return user !== undefined;
  }

  async getByEmail(email: string, includes?: string): Promise<AppUserModel> {
    if(includes) return AppUserModel.query().findOne('email', '=', email).withGraphJoined(includes);
    return AppUserModel.query().findOne('email', '=', email);
  }

  async updatePasswordAndResetRequest(userId: number, password: string, resetPasswordAttemptId: number): Promise<void> {
    const trx = await AppUserModel.startTransaction();
    try {
      await this.patch({ password }, userId);
      await this.resetPasswordAttemptRepository.patch({ used: true }, resetPasswordAttemptId, trx);
      trx.commit();
    } catch (error) {
      trx.rollback();
      throw new BaseError('error', error, 500);
    }
  } 
}
