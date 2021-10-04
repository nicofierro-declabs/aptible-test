import { Service } from "typedi";
import { InvitationModel } from "../data-access/models/invitation.model";
import { Practice, PracticeModel } from "../data-access/models/practice.model";
import { PortalUserModel } from "../data-access/models/portal_user.model";
import { InvitationRepository } from "../data-access/repositories/InvitationRepository";
import { PracticeRepository } from "../data-access/repositories/PracticeRepository";
import { PortalUserRepository } from "../data-access/repositories/PortalUserRepository";
import { InvalidParamError } from "../utils/errors";

@Service()
export class PracticeService {
    private readonly practiceRepository: PracticeRepository;

    private readonly portalUserRepository: PortalUserRepository;
    
    private readonly invitationRepository: InvitationRepository;

    constructor() {
        // TODO: implement DI
        this.practiceRepository = new PracticeRepository(PracticeModel);
        this.portalUserRepository = new PortalUserRepository(PortalUserModel);
        this.invitationRepository = new InvitationRepository(InvitationModel);

    }

    async getPractices(): Promise<PracticeModel[]> {
        return this.practiceRepository.getAll();
    }

    async createPractice(userId: number, practice: Practice): Promise<Practice> {
        return this.practiceRepository.create(practice as PracticeModel);
    }

    async getSeatsAvailables(userId: number, practiceId: number): Promise<[number, number]> {
        const practice = await this.practiceRepository.findById(practiceId);
        if (!practice) throw new InvalidParamError(`Practice does't exist`);
        const total = practice.seats;
        const users = await this.portalUserRepository.getDoctorUsersByPracticeId(practiceId);
        const invitations = await this.invitationRepository.getInvitationsByPracticeId(practiceId);
        const used = users.length + invitations.length;
        return [total, used];
    }
}