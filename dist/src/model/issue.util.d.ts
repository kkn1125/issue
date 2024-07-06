type RandomValueProps = {
    min?: number;
    max?: number;
};
type HasKey<K extends string | number | symbol> = {
    [k in K]: any;
};
export declare class Util {
    hasIn<K extends string>(obj: object, key: K): obj is HasKey<K>;
    safeDiv(a: number, b: number): number;
    makeRandomValue(props?: RandomValueProps): number;
}
export {};
