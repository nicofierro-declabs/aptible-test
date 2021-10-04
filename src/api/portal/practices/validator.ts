import Joi from "joi";
import { PracticeIn } from "./dto";

export const postPracticeValidator = Joi.object<PracticeIn>({
    npi: Joi.string().required(),
    practiceType: Joi.string().required(),
    address: Joi.string().required(),
})