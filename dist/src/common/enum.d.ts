export type LogOption = {
    Label: "LOG" | "INFO" | "DEBUG" | "WARN" | "ERROR";
    Sign: "🪵" | "✨" | "🐛" | "⚠️" | "🔥";
};
export type LogLevelOptions = {
    [k in "Log" | "Info" | "Debug" | "Warn" | "Error"]: LogOption;
};
export declare const LogLevel: LogLevelOptions;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
export declare const IssueProtocol: {
    readonly OK: readonly [100, "ok"];
    readonly DONE: readonly [101, "done"];
    readonly PASS: readonly [102, "pass"];
    readonly SOLVING: readonly [103, "solving"];
    readonly ASYNC_SOLVING: readonly [104, "async solving"];
    readonly TIMESTAMP: readonly [105, "timestamp"];
    readonly DOING: readonly [106, "doing"];
    readonly CREATED: readonly [200, "created"];
    readonly UPDATED: readonly [201, "updated"];
    readonly DELETED: readonly [202, "deleted"];
    readonly EMPTY: readonly [300, "empty"];
    readonly WRONG_VALUE: readonly [301, "wrong value"];
    readonly UNKNOWN: readonly [302, "unknown"];
    readonly NULL: readonly [303, "null"];
    readonly UNDEFINED: readonly [304, "undefined"];
    readonly RETURN: readonly [305, "return"];
    readonly NO_RETURN: readonly [306, "no return"];
    readonly NOT_FOUND: readonly [400, "not found"];
    readonly NOT_WORK: readonly [401, "not work"];
    readonly OUT: readonly [402, "out"];
    readonly IGNORE: readonly [403, "ignore"];
    readonly INCLUDE: readonly [404, "include"];
    readonly EXCLUDE: readonly [405, "exclude"];
    readonly USING: readonly [406, "using"];
    readonly ERROR: readonly [1000, "error"];
    readonly FATAL: readonly [1001, "fatal"];
};
export type IssueProtocol = (typeof IssueProtocol)[keyof typeof IssueProtocol];
