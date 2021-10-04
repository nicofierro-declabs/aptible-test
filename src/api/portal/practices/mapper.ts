import { Practice } from "../../../data-access/models/practice.model";
import { PracticeIn } from "./dto";

export const practiceInToPractice = (model: PracticeIn): Practice => {
    const practice = {
        practiceId: undefined,
        npi: model.npi,
        practiceType: model.practiceType,
        address: model.address,
        seats: model.seats
    }
    return practice;
}