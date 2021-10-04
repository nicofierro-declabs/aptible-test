import 'reflect-metadata';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import AppUserService from '../../../services/AppUserService';
import apiResponse from '../../utils/api-responses';
import { editUserModelInToUser, signUpModelInToAppUser, updatedUserModelOutput } from './mapper';
import { AppUserAuthModelOut, EditUserModelIn } from './dto';

const appUserService = Container.get(AppUserService);

export const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
  const user = await appUserService.getUserById(req.claims?.userId!);
  const result: AppUserAuthModelOut = {
    id: user.appUserId!,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  };
  return apiResponse.ok(res, result); 
}

export const patchUser = async (req: Request, res: Response): Promise<Response> => {
  const { security } = req.body as EditUserModelIn;
  const user = editUserModelInToUser(req.body as EditUserModelIn);
  const updatedUser = await appUserService.editUser(req.claims?.userId!, user, security?.currentPassword, security?.newPassword);
  return apiResponse.ok(res, updatedUserModelOutput(updatedUser));
}

export const postAppUserSignup = async (req: Request, res: Response): Promise<Response> => {
  const newUser = signUpModelInToAppUser(req.body);
  const user = await appUserService.signUp(newUser);
  return apiResponse.ok(res, user);
}

export const postLoginAppUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const [user, token] = await appUserService.logIn(email, password);
  const result: AppUserAuthModelOut = {
    id: user.appUserId!,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    token,
  };
  return apiResponse.ok(res, result);
}

export const postResetPassword = async (req: Request, res: Response): Promise<Response> => {
  await appUserService.resetPasswordRequest(req.body.email);
  return apiResponse.ok(res);
}

export const postNewPassword = async (req: Request, res: Response): Promise<Response> => {
  const { userId, guid, password } = req.body;
  await appUserService.setNewPasswordFromReset(userId, guid, password);
  return apiResponse.ok(res);
}