import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response } from 'express';
import apiResponse from '../../utils/api-responses';
import { PatientService } from '../../../services/PatientService';
import { registerPatientInToPatient } from './mapper';

const patientService = Container.get(PatientService);

export const getAllPatients = async (req: Request, res: Response): Promise<Response> => {
    const patients = await patientService.getPatients();
    return apiResponse.ok(res, patients);
};

export const postPatient = async (req: Request, res: Response): Promise<Response> => {
    const patientBody = registerPatientInToPatient(req.body);
    const patient = await patientService.createPatient(req.claims?.userId!, patientBody);
    return apiResponse.ok(res, patient);
};
