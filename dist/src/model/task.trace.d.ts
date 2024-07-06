import { IssueProtocol } from "../common/enum";
export type LogLine = {
    code: IssueProtocol[0];
    message: string;
    detail?: any | any[];
};
export type WriteProps = {
    protocol: keyof typeof IssueProtocol;
    detail?: any | any[];
};
export declare class TaskTrace {
    #private;
    show(): LogLine[];
    write({ protocol, detail }: WriteProps): void;
}
