import { Permission } from "../data-access/models/permission.model";

export const isAllowed = (permissions: PermissionCode[], userPermissions: Permission[]) => {
    let isAllowed: boolean = true;
    permissions.forEach(p => {
        if(userPermissions.findIndex(up => up.permission === p) === -1) isAllowed = false;
    })
    return isAllowed;
}

export type PermissionCode =
    'ADD_PATIENT' |
    'VIEW_PATIENTS';


/*
    Actions: VIEW-ADD
    Entities: User-Patient

    Code -- Name -- Description
    VIEW_PATIENTS - View patients - View patient basic information
    VIEW_PATIENT-HEALTH - View patient health detail - View health information about patients
    ADD_PATIENT - Create new patients - Create new patients and link to your patient list
    ADD_PRACTICE - Create new practices - Create new practices for the portal
    VIEW_PRATICES - View practices - View all the practices in the portal
    ADD_PRACTICE-ADMIN - Create practice admin - Create practice admin for the portal
    ADD_USERS - Create users for your practice - Create users for your practice to attend patients
*/