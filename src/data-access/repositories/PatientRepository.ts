/* eslint-disable class-methods-use-this */
import { Service } from "typedi";
import { BaseError } from "../../utils/errors/BaseError";
import { Patient, PatientModel } from "../models/patient.model";
import { PortalUser } from "../models/portal_user.model";
import { BaseRepository } from "./BaseRepository";

@Service()
export class PatientRepository extends BaseRepository<PatientModel> {
  async getPatientsByUserId(userId: number): Promise<Patient[]> {
    const patients = await PatientModel.query().where('portalUserId', '=', userId);
    return patients as Patient[];
  }

  async createPatient(patient: Patient, user: PortalUser): Promise<Patient> {
    try {
      patient.portalUserId = user.portalUserId;
      const newPatient = await this.create(patient as PatientModel);
      return newPatient as Patient;
    } catch (error) {
      throw new BaseError("error", "Something is wrong", 500);
    }
  }
}
