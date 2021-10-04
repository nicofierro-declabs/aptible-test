import { WhereCondition } from "../../types";

export interface IRead<T>  {
    find(whereCondition?: WhereCondition[], orderBy?: string): Promise<T[]>;
    findById(id: number): Promise<T>;
    getAll(includes?: string): Promise<T[]>;
}