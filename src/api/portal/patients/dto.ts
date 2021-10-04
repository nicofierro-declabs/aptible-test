export interface RegisterPatientIn {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    sex: string;
    height: string;
    weight: string;
    race: string;
    ethnicity: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    mobilePhone: string;
    email: string;
    userId?: number;
}