export type FormatOption = {
    h24: boolean;
};
export declare const format: (time: string | number | Date, form?: string, options?: Partial<FormatOption>) => string;
export type FormatStampOption = {
    padding?: boolean;
    showMs?: boolean;
};
export declare const formatStamp: (time: number, options?: FormatStampOption) => string;
