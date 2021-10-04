/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { AppUser, AppUserModel } from "../data-access/models/app_user.model";
import { AppUserRepository } from "../data-access/repositories/AppUserRepository";
import { sendResetPasswordMail } from "../helpers/communication.helper";
import { compare, hashPassword, validPassword } from "../helpers/crypto.helper";
import { encode } from "../helpers/jwt.helper";
import { InvalidDataError, UnauthorizedError } from "../utils/errors";
import {
  ResetPasswordAttempt,
  ResetPasswordAttemptModel,
} from "../data-access/models/reset_password_attempt.model";
import { ResetPasswordAttemptRepository } from "../data-access/repositories/ResetPasswordAttemptRepository";

@Service()
export default class AppUserService {
  private readonly appUserRepository: AppUserRepository;
  private readonly resetPasswordAttemptRepository: ResetPasswordAttemptRepository;

  constructor() {
    this.appUserRepository = new AppUserRepository(AppUserModel);
    this.resetPasswordAttemptRepository = new ResetPasswordAttemptRepository(
      ResetPasswordAttemptModel
    );
  }

  /**
   * signUp
   * @param appUser 
   * @returns AppUserModel object | null
   * Checks on the usage of the given email and validates the password. Then stores the new user in the database. 
   */
  async signUp(appUser: AppUser): Promise<AppUserModel | null> {
    if (await this.appUserRepository.existsUser(appUser))
      throw new InvalidDataError(`Email already in use`);
    if (!validPassword(appUser.password!))
      throw new InvalidDataError(
        `Password doesn't contain the required characters`
      );
    const hash = hashPassword(appUser.password!);
    const appUserModel = appUser as AppUserModel;
    appUserModel.password = hash;
    return this.appUserRepository.create(appUserModel);
  }

  /**
   * logIn
   * @param email 
   * @param password 
   * @returns AppUser objct and auth token
   * Data validation, then creation of auth token. 
   */
  async logIn(email: string, password: string): Promise<[AppUser, string]> {
    const user = await this.appUserRepository.getByEmail(email);
    if (!user) throw new UnauthorizedError("User or password incorrect");
    const isCorrectPassword = compare(password, user.password!);
    if (!isCorrectPassword)
      throw new UnauthorizedError("User or password incorrect");
    const token = encode(user.appUserId!, true);
    return [user as AppUser, token];
  }

  /**
   * getUserById
   * @param id 
   * @param includes 
   * @returns AppUserModel object
   */
  async getUserById(id: number, includes?: string): Promise<AppUserModel> {
    return this.appUserRepository.findById(id, includes);
  }

  /**
   * getNewHashedPasswordWithOldPassword
   * @param userGettedPassword 
   * @param currentPassword 
   * @param newPassword 
   * @returns string -> hashed password
   * This method is used to generate a new password when the user requests it inside the app.
   * It uses the actual password, the old password given by the user and the new one.
   * The validations are, the format of the new password and if the users actual password and the old one given match.
   */
  getNewHashedPasswordWithOldPassword(
    userGettedPassword: string,
    currentPassword: string,
    newPassword: string
  ): string {
    if (!validPassword(newPassword))
      throw new InvalidDataError(
        `Password doesn't contain the required characters.`
      );
    const isCorrectPassword = compare(currentPassword, userGettedPassword);
    if (!isCorrectPassword)
      throw new InvalidDataError("Old password is incorrect.");
    return hashPassword(newPassword);
  }

  /**
   * getNewHashedPassword
   * @param password 
   * @returns string -> hashed password
   * This method is used to generate a new hashed password when the user requests it outside the app.
   * It uses only the new password given.
   */
  getNewHashedPassword(password: string): string {
    if (!validPassword(password))
      throw new InvalidDataError(
        `Password doesn't contain the required characters.`
      );
    return hashPassword(password);
  }

  /**
   * editUser
   * @param userId 
   * @param user 
   * @param currentPassword 
   * @param newPassword 
   * @returns AppUserModel object
   * Generic method to update (patch) the user data. It can be used for personal data, security (password) and settings (TBD).
   * The user received in the paremeter is already updated with the new data, that's done in the mapper in the controller.
   * TODO -> Revisit comments when new sections to update are added in the logic.
   */
  async editUser(
    userId: number,
    user: Partial<AppUser>,
    currentPassword?: string,
    newPassword?: string
  ): Promise<AppUserModel> {
    const userToUpdate: Partial<AppUser> = user;
    if (user.email) {
      const userByEmail = await this.appUserRepository.getByEmail(user.email!);
      if (userByEmail && userByEmail.appUserId !== user.appUserId)
        throw new InvalidDataError("Email is already in use.");
    }
    const userGetted = await this.appUserRepository.findById(userId);
    if (currentPassword && newPassword)
      userToUpdate.password = this.getNewHashedPasswordWithOldPassword(
        userGetted.password!,
        currentPassword,
        newPassword
      );
    const updated = await this.appUserRepository.patch(userToUpdate, userId);
    return updated as AppUserModel;
  }

  /**
   * resetPasswordRequest
   * @param email 
   * Method used to request a password reset, this stores the attempt (reset_password_attemps in db) 
   * and sends an email to the user with the reset link (using a deeplink with Branch).
   * It doesn't return anything, only 200-OK on the controller.
   */
  async resetPasswordRequest(email: string): Promise<void> {
    const user = await this.appUserRepository.getByEmail(email);
    if (user) {
      const guid = uuidv4();
      const resetPasswordAttempt: ResetPasswordAttempt = {
        guid,
        appUserId: user.appUserId,
        used: false,
        resetPasswordAttemptId: undefined,
        appUser: undefined,
        portalUserId: undefined,
        portalUser: undefined,
      };
      await this.resetPasswordAttemptRepository.create(
        resetPasswordAttempt as ResetPasswordAttemptModel
      );
      sendResetPasswordMail(email, user.appUserId!, guid);
    }
  }

  /**
   * setNewPasswordFromReset
   * @param userId 
   * @param guid 
   * @param password 
   * Method used to update a password from a reset password request.
   * A transaction is crated in AppUserRepository to store the new password and update the request
   * in 'reset_password_attemps' (db).
   */
  async setNewPasswordFromReset(userId: number, guid: string, password: string): Promise<void> {
    const resetPasswordAttempt = await this.resetPasswordAttemptRepository.findByGiud(guid);
    if (!resetPasswordAttempt)
      throw new InvalidDataError(
        "No new password request found with that giud."
      );
    if (
      (resetPasswordAttempt.appUserId &&
        resetPasswordAttempt.appUserId !== userId) ||
      (resetPasswordAttempt.portalUserId &&
        resetPasswordAttempt.portalUserId !== userId)
    ) {
      throw new InvalidDataError("User and request Id doesn't match.");
    }
    const newPassword = this.getNewHashedPassword(password);
    await this.appUserRepository.updatePasswordAndResetRequest(userId, newPassword, resetPasswordAttempt.resetPasswordAttemptId!);
  }
}
