import { PortalUser } from "../../../data-access/models/portal_user.model";
import { EditAccountInfoIn, SignUpModelIn, TeamMemberModelIn } from "./dto";

export const signUpModelInToUser = (model: SignUpModelIn): PortalUser => {
    const user = {
        portalUserId: undefined,
        email: model.email,
        password: model.password,
        firstName: model.firstName,
        lastName: model.lastName,
        mobilePhone: model.mobilePhone,
        officePhone: model.officePhone,
        permissions: [],
        practiceId: model.practiceId,
        practice: undefined,
        systemRoleId: model.systemRoleId,
        systemRole: undefined,
        role: undefined,
        npi: undefined,
        speciality: undefined,
        prefix: undefined,
        mfaEnabled: undefined,
        mfaSettings: undefined
    }
    return user;
}

export const teamMemberModelInToUser = (model: TeamMemberModelIn): PortalUser => {
    const user = {
        portalUserId: undefined,
        email: model.email,
        password: model.password,
        firstName: model.firstName,
        lastName: model.lastName,
        mobilePhone: model.mobilePhone,
        officePhone: model.officePhone,
        mfaEnabled: model.mfaEnabled ?? false,
        permissions: model.permissions,
        practiceId: undefined,
        practice: undefined,
        systemRoleId: model.systemRoleId,
        systemRole: undefined,
        role: '',
        npi: model.npi,
        speciality: model.speciality,
        prefix: model.prefix,
        mfaSettings: undefined
    }
    return user;
}

export const editAccountInfoInToUser = (model: EditAccountInfoIn): PortalUser => {
    const user: PortalUser = {
        portalUserId: undefined,
        firstName: model.personalInfo.firstName,
        lastName: model.personalInfo.lastName,
        email: model.personalInfo.email,
        mobilePhone: model.personalInfo.mobilePhone,
        officePhone: model.personalInfo.officePhone,
        password: model.security ? model.security.newPassword : '',
        permissions: [],
        practiceId: undefined,
        practice: undefined,
        // TODO: improve
        systemRoleId: 0,
        systemRole: undefined,
        npi: undefined,
        prefix: undefined,
        role: undefined,
        speciality: undefined,
        mfaEnabled: undefined,
        mfaSettings: undefined
    }
    return user;
}