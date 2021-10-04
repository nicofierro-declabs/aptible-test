import Joi from "joi";
import { SignUpModelIn, LogInModelIn, EditAccountInfoIn, TeamMemberModelIn, MfaSettingsIn, MfaVerifyIn } from './dto';

export const postUserValidator = Joi.object<SignUpModelIn>({
    email: Joi.string().email(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobilePhone: Joi.string().required(),
    officePhone: Joi.string().required(),
    practiceId: Joi.number().optional().allow(''),
})

export const logInValidator = Joi.object<LogInModelIn>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const putUserValidator = Joi.object<EditAccountInfoIn>({
    personalInfo: Joi.required(),
    security: Joi.optional(),
    notifications: Joi.required(),
})

export const postInviteValidator = Joi.object<TeamMemberModelIn>({
    systemRoleId: Joi.number().required(),
    npi: Joi.string().optional().allow(''),
    speciality: Joi.string().optional().allow(''),
    prefix: Joi.string().optional().allow(''),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    officePhone: Joi.string().required(),
    mobilePhone: Joi.string().required(),
    permissions: Joi.array().required(),
    password: Joi.string().optional().allow(''),
})

export const registerMfaSettingsValidator = Joi.object<MfaSettingsIn>({
    userId: Joi.number().required(),
    method: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
});

export const verifyTokenValidator = Joi.object<MfaVerifyIn>({
    userId: Joi.number().required(),
    token: Joi.string().required(),
});

export const dataByUserIdValidator = Joi.object<{ userId: number }>({
    userId: Joi.number().required(),
})