import { AppUser, AppUserModel } from "../../../data-access/models/app_user.model";
import { AppUserSignUpModelIn, EditUserModelIn } from "./dto";

export const signUpModelInToAppUser = (model: AppUserSignUpModelIn): AppUser => ({
  appUserId: undefined,
  email: model.email,
  password: model.password,
  firstName: model.firstName,
  lastName: model.lastName,
  mobilePhone: model.mobilePhone,
  dateOfBirth: model.dateOfBirth,
  sex: model.sex,
  height: model.height,
  weight: model.weight,
});

export const editUserModelInToUser = (model: EditUserModelIn): Partial<AppUser> => ({
  email: model.personalInfo?.email,
  firstName: model.personalInfo?.firstName,
  lastName: model.personalInfo?.lastName,
  mobilePhone: model.personalInfo?.mobilePhone,
  dateOfBirth: model.personalInfo?.dateOfBirth,
  sex: model.personalInfo?.sex,
  height: model.personalInfo?.height,
  weight: model.personalInfo?.weight,
});

export const updatedUserModelOutput = (model: AppUserModel): Partial<AppUser> => ({
  email: model.email,
  firstName: model.firstName,
  lastName: model.lastName,
  mobilePhone: model.mobilePhone,
  dateOfBirth: model.dateOfBirth,
  sex: model.sex,
  height: model.height,
  weight: model.weight,
});