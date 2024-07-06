declare const Hobby: {
    readonly Guitar: "guitar";
};
type Hobby = (typeof Hobby)[keyof typeof Hobby];
export declare const inject: {
    name: string;
    age: number;
    hobby: Hobby;
};
export {};
