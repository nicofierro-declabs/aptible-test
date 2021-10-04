import { Service } from "typedi";
import knex from "../../config/db/knex";
import { InvitationModel } from "../models/invitation.model";
import { BaseRepository } from "./BaseRepository";

@Service()
export class InvitationRepository extends BaseRepository<InvitationModel> {
    async getInvitationByInviteGuid(inviteGuid: string): Promise<InvitationModel> {
        return InvitationModel.query().findOne('invite_guid', '=', inviteGuid);
    }
    async getInvitationsByPracticeId(practiceId: number): Promise<Array<InvitationModel>> {
        return knex('invitations').select().whereRaw(`user_form->> 'practiceId' = '${practiceId}' and expired_at >= NOW() and user_form->> 'systemRoleId' = '3' and state <> 'accepted'`);
    }
}