export interface AppUserSignUpModelIn {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobilePhone?: string,
  dateOfBirth?: string,
  sex?: string,
  height?: string,
  weight?: string,
};

export interface AppUserLoginModelIn {
  email: string;
  password: string;
};

export interface AppUserAuthModelOut {
  id: number;
  name: string;
  email: string;
  token?: string;
}

interface PersonalInfo {
  email: string;
  firstName: string;
  lastName: string;
  mobilePhone?: string;
  dateOfBirth?: string;
  sex?: string;
  height?: string;
  weight?: string;
}

interface Security {
  currentPassword: string;
  newPassword: string;
}
export interface EditUserModelIn {
  personalInfo?: PersonalInfo;
  security?: Security;
  // TODO -> settings?: <Notifications | etc | TBD>:
}