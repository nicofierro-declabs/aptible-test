import { Service } from "typedi";
import { Patient, PatientModel } from "../data-access/models/patient.model";
import { PortalUser, PortalUserModel } from "../data-access/models/portal_user.model";
import { PatientRepository } from "../data-access/repositories/PatientRepository";
import { PortalUserRepository } from "../data-access/repositories/PortalUserRepository";

@Service()
export class PatientService {
    private readonly patientRepository: PatientRepository;
    
    private readonly portalUserRepository: PortalUserRepository;

    constructor() {
        // TODO: implement DI
        this.patientRepository = new PatientRepository(PatientModel);
        this.portalUserRepository = new PortalUserRepository(PortalUserModel);
    }

    async getPatients(): Promise<PatientModel[]> {
        return this.patientRepository.getAll();
    }
    
    async createPatient(userId: number, patient: Patient): Promise<Patient> {
        const user = await this.portalUserRepository.findById(userId) as PortalUser;
        return this.patientRepository.createPatient(patient, user);
    }
}