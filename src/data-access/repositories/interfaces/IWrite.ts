export interface IWrite<T> {
    create(item: T): Promise<T>;
    update(item: T, id: number): Promise<number>;
    delete(id: number): Promise<number>;
}