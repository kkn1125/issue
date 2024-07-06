import { Logger } from "./logger";
import { Util } from "./issue.util";
import { LogLine, TaskTrace } from "./task.trace";
export type Predicate<K = any, R = any> = (issue: Issue, args: K) => R;
export type Solved<T = any> = {
    name: string;
    result: T | null;
    error: Error;
    trace: LogLine[];
};
export declare class Issue {
    #private;
    static set mode(mode: Mode);
    static get mode(): Mode;
    static get version(): string;
    static get logger(): Logger;
    static util: Util;
    static task(name: string): Issue;
    static solve<T = any>(issue: Issue): Solved<T>;
    static solveAsync(issue: Issue): Promise<Solved>;
    deepcopy(): Issue;
    get size(): number;
    throw: boolean;
    name: string;
    logger: Logger;
    taskTrace: TaskTrace;
    constructor();
    constructor(name: string);
    use<T extends [...any]>(args: T): void;
    pipe<K extends any, R extends any>(predicate: Predicate<K, R>): void;
    try(predicate: Predicate): void;
    protected copyCatch(): (error?: any) => void;
    catch(predicate: Predicate): void;
    finally(predicate: Predicate): void;
}
export declare class TryIssue extends Issue {
    do: Predicate;
    constructor(predicate: Predicate);
}
