/* eslint-disable lines-between-class-members */
import 'reflect-metadata';
import { DateTime } from "luxon";
import { Service } from "typedi";
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy';
import { MultiFactorAuth, MultiFactorAuthModel } from "../data-access/models/multi_factor_auth.model";
import { Patient, PatientModel } from "../data-access/models/patient.model";
import { PortalUser, PortalUserModel } from "../data-access/models/portal_user.model";
import { PortalUserRepository } from "../data-access/repositories/PortalUserRepository";
import { compare, hashPassword, validPassword } from "../helpers/crypto.helper";
import { encode } from "../helpers/jwt.helper";
import { InvalidDataError, InvalidParamError, UnauthorizedError } from "../utils/errors";
import { BaseError } from "../utils/errors/BaseError";
import { InvitationRepository } from "../data-access/repositories/InvitationRepository";
import { Invitation, InvitationModel } from "../data-access/models/invitation.model";
import { sendCodeSMS, sendInvitationMail } from "../helpers/communication.helper";
import config from "../config/config"
import { MultiFactorAuthRepository } from "../data-access/repositories/MultiFactorAuthRepository";
import { PracticeService } from "./PracticeService";
import { MultiFactorAuthBackupCodesModel } from '../data-access/models/multi_factor_auth_backup_codes.model';
import { MultiFactorAuthBackupCodesRepository } from '../data-access/repositories/MultiFactorAuthBackupCodesRepository';
import { PatientRepository } from '../data-access/repositories/PatientRepository';

@Service()
export class PortalUserService {
    private readonly portalUserRepository: PortalUserRepository;
    private readonly invitationRepository: InvitationRepository;
    private readonly multiFactorAuthRepository: MultiFactorAuthRepository;
    private readonly multiFactorAuthBackupCodesRepository: MultiFactorAuthBackupCodesRepository;
    private readonly patientsRepository: PatientRepository;

    constructor(private practiceService: PracticeService) {
        // TODO: implement DI
        this.portalUserRepository = new PortalUserRepository(PortalUserModel);
        this.invitationRepository = new InvitationRepository(InvitationModel);
        this.multiFactorAuthRepository = new MultiFactorAuthRepository(MultiFactorAuthModel);
        this.multiFactorAuthBackupCodesRepository = new MultiFactorAuthBackupCodesRepository(MultiFactorAuthBackupCodesModel);
        this.patientsRepository = new PatientRepository(PatientModel);
    }

    async getTeamMembers(userId: number): Promise<Array<PortalUserModel>> {
        const user = await this.portalUserRepository.getUserById(userId);
        if (!user) throw new InvalidDataError(`User doesn't exist`);
        const users = await this.portalUserRepository.getTeamMembersByPracticeId(user.practiceId!);
        const team = users.filter(x => x.portalUserId !== user.portalUserId);
        return team;
    }

    async getUserByInviteGuid(inviteGuid: string, numberCode: number): Promise<any> {
        const invitation = await this.invitationRepository.getInvitationByInviteGuid(inviteGuid);
        if (invitation.numberCode === numberCode)
            return invitation.userForm;
        throw new InvalidParamError('Number code is invalid');
    }

    async getUsers(): Promise<PortalUserModel[]> {
        return this.portalUserRepository.getAll('[systemRole, practice]');
    }

    async getUserById(id: number, includes?: string): Promise<PortalUserModel> {
        return this.portalUserRepository.findById(id, includes);
    }

    async registerInvite(userId: number, user: PortalUser): Promise<PortalUser> {
        if (await this.portalUserRepository.existUser(user)) throw new InvalidDataError('Email already in use');

        const hostUser = await this.portalUserRepository.findById(userId);
        if (!hostUser) throw new InvalidDataError(`User does't exist`);

        user.practiceId = hostUser.practiceId;

        const availables = await this.practiceService.getSeatsAvailables(userId, user.practiceId!);
        const totalSeats = availables[0];
        const usedSeats = availables[1];
        if ((totalSeats - usedSeats) < 1) throw new InvalidDataError(`Practice doesn't have seats availables`);

        const userJSON = JSON.stringify(user);
        const inviteGuid = uuidv4();
        const numberCode = Math.floor(100000 + Math.random() * 900000);

        const expirationDate = new Date();
        const daysExpiration = +config.INVITATION_EXPIRATION_DAYS!;
        expirationDate.setDate(expirationDate.getDate() + daysExpiration);

        const invitation: Invitation = {
            invitationId: undefined,
            inviteGuid,
            state: 'pending',
            numberCode,
            expiredAt: expirationDate.toISOString(),
            userForm: userJSON,
            hostUserId: userId,
            hostUser: undefined,
            inviteUser: undefined,
            inviteUserId: undefined
        }

        await this.invitationRepository.create(invitation as InvitationModel);
        sendInvitationMail(`${config.REDIRECT_URL}/${inviteGuid}`, numberCode, user.email);
        return user;
    }

    async registerTeamMember(numberCode: number, inviteGuid: string, user: PortalUser): Promise<void> {
        const invite = await this.invitationRepository.getInvitationByInviteGuid(inviteGuid);
        if (!invite) throw new InvalidDataError(`Invite code doesn't exist`);
        if (numberCode !== invite.numberCode) throw new InvalidParamError('Number code is invalid');
        if (invite.state !== 'pending') throw new InvalidDataError(`Invitation is not pending`);
        const expired = DateTime.fromISO(invite.expiredAt);
        if (expired <= DateTime.now()) {
            invite.state = 'expired';
            await this.invitationRepository.patch(invite, invite.invitationId!);
            throw new InvalidDataError(`Invite is expired`);
        }
        invite.state = 'accepted';
        if (!validPassword(user.password!)) throw new InvalidDataError(`Password doesn't contain the required characters`);
        const hash = hashPassword(user.password!);
        user.password = hash;
        const userInvite = JSON.parse(JSON.stringify(invite.userForm)) as PortalUser;
        user.permissions = userInvite.permissions;
        user.practiceId = userInvite.practiceId;
        await this.portalUserRepository.registerTeamMember(user as PortalUserModel, invite);
    }

    async signUp(userId: number, user: PortalUser): Promise<PortalUserModel | null> {
        if (!validPassword(user.password!)) throw new InvalidDataError(`Password doesn't contain the required characters`);
        const hash = hashPassword(user.password!);
        const userModel = user as PortalUserModel;
        userModel.password = hash;
        if (await this.portalUserRepository.existUser(user)) throw new InvalidDataError('Email already in use');
        return this.portalUserRepository.create(userModel);
    }

    async logIn(email: string, password: string): Promise<[PortalUser, string]> {
        const user = await this.portalUserRepository.getByEmail(email, '[mfaSettings]');
        if (user === undefined) throw new UnauthorizedError('User or password incorrect');
        const isCorrectPassword = compare(password, user.password!);
        if (isCorrectPassword === false) throw new UnauthorizedError('User or password incorrect');
        const token = encode(user.portalUserId!);
        return [user as PortalUser, token];
    }

    async editUser(userId: number, user: PortalUser, currentPassword?: string, confirmPassword?: string): Promise<void> {
        const userGetted = await this.portalUserRepository.findById(user.portalUserId!);
        const userByEmail = await this.portalUserRepository.getByEmail(user.email)

        if (userByEmail && userByEmail.portalUserId !== user.portalUserId) throw new InvalidDataError('Email is already in use');

        userGetted.firstName = user.firstName;
        userGetted.lastName = user.lastName;
        userGetted.mobilePhone = user.mobilePhone;
        userGetted.officePhone = user.officePhone;
        userGetted.email = user.email;

        if (currentPassword && confirmPassword) {
            if (!validPassword(user.password!)) throw new InvalidDataError(`Password doesn't contain the required characters`);
            const isCorrectPassword = compare(currentPassword, userGetted.password!);
            if (!isCorrectPassword) throw new InvalidDataError('Old password is incorrect');
            if (user.password !== confirmPassword) throw new InvalidDataError('Passwords do not match');
            const passwordHashed = hashPassword(user.password);
            userGetted.password = passwordHashed;
        }

        const rowsAffected = await this.portalUserRepository.update(userGetted, userGetted.portalUserId!);
        if (rowsAffected === 0) throw new BaseError('error', 'Something is wrong', 500);
    }

    async getPatientsByUser(userId: number): Promise<Patient[]> {
        const patients = await this.patientsRepository.getPatientsByUserId(userId);
        return patients;
    }

    /**
     * 
     * @param userId 
     * @param method 
     * @param phoneNumber 
     * @returns MultiFactorAuthModel | null
     * This is executed only on the first time, when the user configures the MFA settings.
     * A MFA settings object is created using speakeasy library to generate the temporary secret.
     * If the selected method is 'SMS' (send the code to a mobile phone), it will call "sendCodeSMS" method.
     */
    async registerMfaSettings(userId: number, method: string, phoneNumber?: string): Promise<MultiFactorAuthModel | null> {
        const { base32, otpauth_url: otpauthUrl } = speakeasy.generateSecret();
        const mfaSettings: Partial<MultiFactorAuth> = { portalUserId: userId, method, tempSecret: base32, phoneNumber, otpauthUrl };
        let settings = await this.multiFactorAuthRepository.storeAuthenticatorAuthMethod(mfaSettings);
        if (method.toLowerCase() === 'sms' && phoneNumber) {
            const code = speakeasy.totp({
                secret: base32,
                encoding: 'base32',
            });
            await sendCodeSMS(phoneNumber, code);
        }
        if (settings.otpauthUrl) {
            const qrUrl = await QRCode.toDataURL(settings.otpauthUrl);
            settings = { ...settings, otpauthUrl: qrUrl } as MultiFactorAuthModel
        }
        return settings;
    };

    /**
     * 
     * @param userSecret 
     * @param token 
     * @returns boolean -> result of the validation of the given token against the given userSecret.
     */
    private verifyToken = (userSecret: string, token: string): boolean => {
        const result = speakeasy.totp.verify({
            secret: userSecret,
            encoding: 'base32',
            token,
            window: 1,
        });
        return result;
    }

    /**
     * 
     * @param userId 
     * @param token 
     * @returns Array of parsed codes || null
     * Fetch the MFA Settings of a given user. Validate the given token against the temporary secret of the user.
     * If it's successfully validated, the temporary secret is updated to a permanent one in the MFA Settings.
     * The backup codes are generated as soon as the temporary secret is validated, and those are returned.
     * If the token is not valid, it just returns null.
     */
    async validateMfaSettings(userId: number, token: string): Promise<string[] | null> {
        const { mfaSettings } = await this.getUserById(userId, '[mfaSettings]');
        if (!mfaSettings || !mfaSettings.tempSecret) {
            throw new UnauthorizedError('User needs to register the multi factor settings.')
        }
        else {
            const tokenValidates = this.verifyToken(mfaSettings.tempSecret, token);
            if (tokenValidates) {
                const updatedSettings = {
                    tempSecret: null,
                    secret: mfaSettings.tempSecret,
                }
                await this.multiFactorAuthRepository.validateAuthenticator(userId, updatedSettings as Partial<MultiFactorAuth>, mfaSettings.id!);
                await this.portalUserRepository.patch({ mfaEnabled: true } as Partial<PortalUserModel>, userId);
                const backupCodes = await this.multiFactorAuthBackupCodesRepository.getUserBackupCodes(userId);
                return this.parseCodes(backupCodes);
            }
            return null;
        }
    };

    /**
     * 
     * @param userId 
     * @param token 
     * @returns MFA token validation result
     * This one is used everytime after the initial MFA setup (in that moment "validateMfaSettings" is used)
     * Fetch the Multi-Factor Authentication settings of a user to get the auth secret (it checks it's configured as well)
     * Before validating against the MFA Settings secret, we check if it matches with a backup code of the user.
     * If the token validates a backup code, that code it's deleted from the database and returns validated = true.
     * Else, the token is validated against the secret stores in the MFA settings and returns the result of the validation.
     */
    async verifyUserToken(userId: number, token: string): Promise<boolean> {
        const { mfaSettings } = await this.getUserById(userId, '[mfaSettings]');
        if (!mfaSettings || !mfaSettings.secret) {
            throw new UnauthorizedError("User doesn't have a secret token configured.");
        }
        const backupCode = await this.multiFactorAuthBackupCodesRepository.find([
            {
                column: 'portalUserId',
                operator: '=',
                value: `${userId}`
            },
            {
                column: 'token',
                operator: '=',
                value: token
            }
        ]);
        if (backupCode[0]) {
            await this.multiFactorAuthBackupCodesRepository.delete(backupCode[0].id!);
            return true;
        }
        const tokenValidates = this.verifyToken(mfaSettings.secret, token);
        if (tokenValidates) {
            return true;
        };
        return false;
    };

    /**
     * 
     * @param userId 
     * Fetch the Multi-Factor Authentication settings of a user to get the auth secret, generates a token and sends it
     * via SMS to the user.
     */
    async sendSMSToken(userId: number): Promise<void> {
        const mfaSettings = await this.multiFactorAuthRepository.findByUserId(userId);
        if (!mfaSettings || !mfaSettings.secret || !mfaSettings.phoneNumber) {
            throw new UnauthorizedError("User doesn't have a secret token configured.");
        } else if (mfaSettings.method.toLowerCase() !== 'sms') {
            throw new UnauthorizedError("User doesn't have MFA through SMS enabled.")
        } else {
            const code = speakeasy.totp({
                secret: mfaSettings.secret,
                encoding: 'base32',
            });
            await sendCodeSMS(mfaSettings.phoneNumber, code);
        }
    };

    /**
     * 
     * @param userId 
     * @returns The backup codes (parsed) of a given user.
     */
    async getMfaBackupCodes(userId: number): Promise<string[]> {
        const backupCodes = await this.multiFactorAuthBackupCodesRepository.getUserBackupCodes(userId);
        if (!backupCodes) {
            throw new UnauthorizedError("User doesn't have Multi Factor Authentication enabled.");
        }
        return this.parseCodes(backupCodes);
    }

    /**
     * 
     * @param codes 
     * @returns Array of parsed codes
     * Recieves a list of backup codes (the whole object) and returns a list with only the token.
     */
    // eslint-disable-next-line class-methods-use-this
    private parseCodes(codes: MultiFactorAuthBackupCodesModel[]): string[] {
        return codes.map((codeItem) => codeItem.token);
    }
    
    /**
     * generateNewBackupCodes
     * @param userId
     * @returns Array of backup codes
     * Calls the generateNewBackupCodes from the MultiFactorAuthBakcup Repository, this deletes 
     * the remaining codes and generates a new set under the same transaction.
     */
    async generateNewBackupCodes(userId: number): Promise<string[]> {
        const mfaSettings = await this.multiFactorAuthRepository.findByUserId(userId);
        if (!mfaSettings || !mfaSettings.secret) {
            throw new UnauthorizedError("User doesn't have a secret token configured.");
        } else {
            await this.multiFactorAuthBackupCodesRepository.generateNewBackupCodes(userId, mfaSettings.secret);
            const codes = await this.multiFactorAuthBackupCodesRepository.getUserBackupCodes(userId);
            return this.parseCodes(codes);
        }
    }
}