import { MultiFactorAuth } from "../../../data-access/models/multi_factor_auth.model";

export interface SignUpModelIn {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobilePhone?: string;
    officePhone?: string;
    systemRoleId: number;
    practiceId?: number;
    // ...
}
interface PermissionModel {
    permissionId: number;
    permission: string;
    name: string;
    description: string;
}
export interface TeamMemberModelIn {
    systemRoleId: number;
    npi?: string;
    speciality?: string;
    prefix?: string;
    firstName: string;
    lastName: string;
    email: string;
    practiceId: number;
    officePhone: string;
    mobilePhone: string;
    mfaEnabled?: boolean;
    password?: string;
    permissions: PermissionModel[];
}

export interface LogInModelIn {
    email: string;
    password: string;
}
export interface LogInModelOut {
    id: number;
    name: string;
    email: string;
    role: number;
    mfaEnabled?: boolean;
    mfaSettings?: MultiFactorAuth;
}
interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    officePhone: string;
    mobilePhone?: string;
}
interface Security {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    // TODO: primary-secondary authentication method
}
interface Notifications {
    id: number[];
}
export interface MfaSettingsIn {
    userId: number;
    method: string;
    phoneNumber?: string;
}
export interface MfaVerifyIn {
    userId: number;
    token: string;
}
export interface EditAccountInfoIn {
    personalInfo: PersonalInfo;
    security?: Security;
    notifications: Notifications;
}