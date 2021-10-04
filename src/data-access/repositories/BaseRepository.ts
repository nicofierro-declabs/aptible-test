import { Model, ModelClass, QueryBuilder, Transaction } from "objection";
import { IRead } from "./interfaces/IRead";
import { IWrite } from "./interfaces/IWrite";
import db from '../../config/db/knex'
import { WhereCondition } from "../types";

export abstract class BaseRepository<T extends Model> implements IWrite<T>, IRead<T> {

    // "any" is a workaround because with T is not working
    private readonly model: ModelClass<any>;

    constructor(model: ModelClass<T>) {
        this.model = model.bindKnex(db);
    };

    getAll(includes?: string): Promise<T[]> {
        if(includes) return this.model.query().withGraphJoined(includes);
        return this.model.query();
    };

    async find(whereCondition?: WhereCondition[], orderBy?: string): Promise<T[]> {
        const result = await this.model.query().where((builder: QueryBuilder<T, T[]>) => {
            whereCondition?.forEach(wc => {
                builder.where(wc.column, wc.operator, wc.value);
            })
        })
        orderBy && await result.orderBy(orderBy);
        return result;
    };

    findById(id: number, includes?: string): Promise<T> {
        if(includes) return this.model.query().findById(id).withGraphJoined(includes);
        return this.model.query().findById(id);
    };

    create(item: T, trx?: Transaction): Promise<T> {
        return this.model.query(trx).insert(item);
    };

    update(item: T, id: number, trx?: Transaction): Promise<number> {
        return this.model.query(trx).findById(id).update(item);
    };

    patch(item: Partial<T>, id: number, trx?: Transaction): Promise<T> {
        return this.model.query(trx).findById(id).patch(item).returning("*"); // TODO: Remove password from return
    };

    upsert(item: T, conflict: string, trx?: Transaction): Promise<T> {
        return this.model.query(trx).insert(item).onConflict(conflict).merge().returning("*");
    }

    delete(id: number, trx?: Transaction): Promise<number> {
        return this.model.query(trx).deleteById(id);
    };

    softDelete(id: number, trx?: Transaction): Promise<number> {
        return this.model.query(trx).findById(id).update({ deletedAt: db.fn.now() });
    };
}