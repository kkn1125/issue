export declare const isNil: (value: null | undefined | unknown) => value is null | undefined;
type ObjectHasKey<K extends string | number | symbol> = {
    [key in K]: any;
};
export declare function hasObjectIn<K extends string>(object: object, key: K): object is ObjectHasKey<K>;
export declare const isAsyncFunction: (func: Function | Promise<any>) => boolean;
export {};
