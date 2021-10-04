/* eslint-disable lines-between-class-members */
import { Model, ModelObject } from 'objection';

export class PracticeModel extends Model {

    static get tableName() {
        return 'practices';
    }

    static get idColumn() {
        return 'practiceId'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                practiceId: { type: 'integer' },
                npi: { type: 'string' },
                practiceType: { type: 'string', },
                address: { type: 'string' },
                seats: { type: 'integer' }
            }
        }
    }

    public practiceId!: number | undefined;
    public npi!: string;
    public practiceType!: string;
    public address!: string;
    public seats!: number;
}

export type Practice = ModelObject<PracticeModel>;