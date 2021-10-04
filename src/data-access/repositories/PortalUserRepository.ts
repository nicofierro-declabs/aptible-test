/* eslint-disable class-methods-use-this */
import { Service } from "typedi";
import { BaseError } from "../../utils/errors/BaseError";
import { InvitationModel } from "../models/invitation.model";
import { PortalUser, PortalUserModel } from "../models/portal_user.model";
import { BaseRepository } from "./BaseRepository";

@Service()
export class PortalUserRepository extends BaseRepository<PortalUserModel> {

    async existUser(user: PortalUser): Promise<boolean> {
        const userGetted = await PortalUserModel.query().findOne('email', '=', user.email);
        return (userGetted !== undefined);
    }

    async getByEmail(email: string, includes?: string): Promise<PortalUserModel> {
        if (includes) return PortalUserModel.query().findOne('email', '=', email).withGraphJoined(includes);
        return PortalUserModel.query().findOne('email', '=', email);
    }

    async getUserById(userId: number, includes?: string): Promise<PortalUserModel> {
        return this.findById(userId, includes);
    }

    async getDoctorUsersByPracticeId(practiceId: number): Promise<Array<PortalUserModel>> {
        return PortalUserModel.query().where('practiceId', '=', practiceId).where('systemRoleId', '=', '3');
    }

    async getTeamMembersByPracticeId(practiceId: number): Promise<Array<PortalUserModel>> {
        return PortalUserModel.query().where('practiceId', '=', practiceId)
            .select('portalUserId', 'email', 'firstName', 'lastName', 'mobilePhone', 'officePhone', 'systemRoleId', 'practiceId', 'role', 'npi', 'speciality', 'prefix');
    }

    async registerTeamMember(user: PortalUserModel, invite: InvitationModel): Promise<PortalUserModel> {
        const trx = await PortalUserModel.startTransaction();
        try {
            const permissions = user.permissions;

            user.permissions = [];
            const newUser = await (PortalUserModel.query(trx).insert(user));
            permissions?.map(async p => {
                await (PortalUserModel.relatedQuery('permissions', trx) as any)
                    .for(newUser.portalUserId).relate(p.permissionId);

            })

            invite.inviteUserId = newUser.portalUserId;
            await InvitationModel.query(trx).findById(invite.invitationId!).patch(invite);
            await trx.commit();
            return newUser;
        }
        catch (error) {
            trx.rollback();
            console.log(error)
            throw new BaseError('error', 'Something is wrong', 500);
        }

    }
}