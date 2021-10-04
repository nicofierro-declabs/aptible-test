import Joi from 'joi';

export const patchUserValidator = Joi.object({
  personalInfo: Joi.object({
    email: Joi.string().email().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    mobilePhone: Joi.string().optional(),
    dateOfBirth: Joi.string().optional(),
    sex: Joi.string().optional(),
    height: Joi.string().optional(),
    weight: Joi.string().optional(),
  }).optional(),
  security: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }).optional(),
});

export const signupValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobilePhone: Joi.string().optional().allow(''),
  dateOfBirth: Joi.string().optional().allow(''),
  sex: Joi.string().optional().allow(''),
  height: Joi.string().optional().allow(''),
  weight: Joi.string().optional().allow(''),
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const resetPasswordValidator = Joi.object({
  email: Joi.string().required(),
});

export const newPasswordFromResetValidator = Joi.object({
  userId: Joi.number().required(),
  guid: Joi.string().required(),
  password: Joi.string().required(),
})