type El<T> = T extends infer R ? R : never;
export declare class Test<T extends object> {
    args: El<T>;
    constructor(inject: T);
}
export {};
