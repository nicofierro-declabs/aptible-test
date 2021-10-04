import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response } from 'express';
import apiResponse from '../../utils/api-responses';
import { PracticeService } from '../../../services/PracticeService';
import { practiceInToPractice } from './mapper';
import { SeatsOut } from './dto';

const practiceService = Container.get(PracticeService);

export const getAllPractices = async (req: Request, res: Response): Promise<Response> => {
    const practices = await practiceService.getPractices();
    return apiResponse.ok(res, practices);
};

export const postPractice = async (req: Request, res: Response): Promise<Response> => {
    const newPractice = practiceInToPractice(req.body);
    const practice = await practiceService.createPractice(req.claims?.userId!, newPractice);
    return apiResponse.ok(res, practice);
};

export const getSeatsAvailables = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const seats = await practiceService.getSeatsAvailables(req.claims?.userId!, +id);
    const seatsOut: SeatsOut = {
        total: seats[0],
        used: seats[1]
    }
    return apiResponse.ok(res, seatsOut);
}