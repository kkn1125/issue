export declare class Logger {
    #private;
    context: string;
    log: (message: unknown, ...optionalMessages: unknown[]) => void;
    info: (message: unknown, ...optionalMessages: unknown[]) => void;
    warn: (message: unknown, ...optionalMessages: unknown[]) => void;
    error: (message: unknown, ...optionalMessages: unknown[]) => void;
    debug: (message: unknown, ...optionalMessages: unknown[]) => void;
    constructor();
    constructor(context: string);
    constructor(context: object);
    setContext(): void;
    setContext(context: string): void;
    setContext(context: object): void;
    private update;
    get timestamp(): string;
}
