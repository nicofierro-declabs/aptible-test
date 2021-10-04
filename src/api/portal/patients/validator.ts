import Joi from "joi";
import { RegisterPatientIn } from "./dto";

export const postPatientValidator = Joi.object<RegisterPatientIn>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    sex: Joi.string().required(),
    height: Joi.string().required(),
    weight: Joi.string().optional().allow(''),
    race: Joi.string().optional().allow(''),
    ethnicity: Joi.string().optional().allow(''),
    streetAddress: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    mobilePhone: Joi.string(),
    email: Joi.string().email().required(),
})