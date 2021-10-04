import { Patient } from "../../../data-access/models/patient.model";
import { RegisterPatientIn } from "./dto";

export const registerPatientInToPatient = (model: RegisterPatientIn): Patient => {
    const patient = {
        patientId: undefined,
        firstName: model.firstName,
        lastName: model.lastName,
        dateOfBirth: model.dateOfBirth,
        sex: model.sex,
        height: model.height,
        weight: model.weight,
        race: model.race,
        ethnicity: model.ethnicity,
        streetAddress: model.streetAddress,
        city: model.city,
        state: model.state,
        zipCode: model.zipCode,
        mobilePhone: model.mobilePhone,
        email: model.email,
        portalUserId: model.userId,
        portalUser: undefined,
        appUserId: undefined,
        appUser: undefined,
    }
    return patient;
}