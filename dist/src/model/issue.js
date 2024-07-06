import { isNil } from "../common/feature";
import { VERSION } from "../common/variable";
import { Logger } from "./logger";
import { Util } from "./issue.util";
import { TaskTrace } from "./task.trace";
export class Issue {
    static #mode = "development";
    static set mode(mode) {
        Issue.logger.log("set mode");
        Issue.#mode = mode;
    }
    static get mode() {
        return this.#mode;
    }
    static get version() {
        return VERSION;
    }
    static get logger() {
        const logger = new Logger();
        return logger;
    }
    static util = new Util();
    static task(name) {
        const issue = new Issue(name);
        return issue;
    }
    static solve(issue) {
        const copyIssue = issue.deepcopy();
        const start = Date.now();
        let result = null;
        let errors = {
            message: "",
            stack: "",
            cause: "",
            name: "",
        };
        copyIssue.taskTrace.write({
            protocol: "SOLVING",
            detail: "solve issues",
        });
        for (const task of copyIssue.#build) {
            let useArgs = null;
            if (!Array.isArray(copyIssue.#useArgs))
                continue;
            useArgs = [...copyIssue.#useArgs];
            copyIssue.#useArgs = [];
            if (task instanceof Issue) {
                try {
                    result = task.do(issue, useArgs);
                    copyIssue.taskTrace.write({
                        protocol: "DOING",
                        detail: [result],
                    });
                }
                catch (error) {
                    copyIssue.#catch(error);
                    if (copyIssue.throw) {
                        throw error;
                    }
                    errors = error;
                }
            }
            else if (task instanceof TryIssue) {
                try {
                    result = task.do(issue, useArgs);
                    copyIssue.taskTrace.write({
                        protocol: "DOING",
                        detail: [result],
                    });
                }
                catch (error) {
                    copyIssue.#catch(error);
                    if (copyIssue.throw) {
                        throw error;
                    }
                    errors = error;
                }
            }
            else if (task instanceof Function) {
                try {
                    result = task(issue, useArgs);
                }
                catch (error) {
                    console.log("error123123123", error);
                    copyIssue.#catch(error);
                    if (copyIssue.throw) {
                        throw error;
                    }
                    errors = error;
                }
                copyIssue.taskTrace.write({
                    protocol: "DOING",
                    detail: [result],
                });
                if (!isNil(result)) {
                    if (Array.isArray(result)) {
                        copyIssue.#useArgs.push(...result);
                    }
                    else {
                        copyIssue.#useArgs.push(result);
                    }
                }
            }
        }
        if (errors.stack)
            result = null;
        const end = Date.now();
        copyIssue.taskTrace.write({
            protocol: "TIMESTAMP",
            detail: {
                start,
                end,
                gap: end - start,
            },
        });
        return {
            name: copyIssue.name,
            result,
            error: errors,
            trace: copyIssue.taskTrace.show(),
        };
    }
    static solveAsync(issue) {
        const copyIssue = new Issue(issue.name);
        Object.assign(copyIssue, issue);
        let result = null;
        let errors = {
            message: "",
            stack: "",
            cause: "",
            name: "",
        };
        return new Promise(async (resolve, reject) => {
            for (const task of copyIssue.#build) {
                let useArgs = null;
                if (!Array.isArray(copyIssue.#useArgs))
                    continue;
                useArgs = [...copyIssue.#useArgs];
                copyIssue.#useArgs = [];
                if (task instanceof Issue) {
                    try {
                        result = task.do(issue, useArgs);
                        copyIssue.taskTrace.write({
                            protocol: "DOING",
                            detail: [result],
                        });
                    }
                    catch (error) {
                        copyIssue.#catch(error);
                        if (copyIssue.throw) {
                            throw error;
                        }
                        errors = error;
                    }
                }
                else if (task instanceof TryIssue) {
                    try {
                        result = await task.do(issue, useArgs);
                        copyIssue.taskTrace.write({
                            protocol: "DOING",
                            detail: [result],
                        });
                    }
                    catch (error) {
                        copyIssue.#catch(error);
                        if (copyIssue.throw) {
                            reject(error);
                            break;
                        }
                        errors = error;
                    }
                    continue;
                }
                if (task instanceof Function) {
                    try {
                        result = await task(issue, useArgs);
                    }
                    catch (error) {
                        copyIssue.#catch(error);
                        if (copyIssue.throw) {
                            reject(error);
                            break;
                        }
                        errors = error;
                    }
                    copyIssue.taskTrace.write({
                        protocol: "DOING",
                        detail: [result],
                    });
                    if (!isNil(result)) {
                        if (Array.isArray(result)) {
                            copyIssue.#useArgs.push(...result);
                        }
                        else {
                            copyIssue.#useArgs.push(result);
                        }
                    }
                    continue;
                }
            }
            if (errors.stack)
                result = null;
            resolve({
                name: copyIssue.name,
                result,
                error: errors,
                trace: copyIssue.taskTrace.show(),
            });
        });
    }
    deepcopy() {
        const newIssue = new Issue(this.name);
        newIssue.use([...this.#useArgs]);
        newIssue.catch(this.copyCatch());
        newIssue.#trycatch = { ...this.#trycatch };
        newIssue.#build = [...this.#build];
        return newIssue;
    }
    get size() {
        return this.#build.length;
    }
    throw = false;
    name;
    #useArgs = [];
    #build = [];
    #trycatch = {
        try: false,
        catch: false,
        finally: false,
    };
    logger;
    taskTrace;
    constructor(name) {
        this.logger = new Logger(this);
        this.taskTrace = new TaskTrace();
        if (name) {
            this.name = name;
        }
    }
    use(args) {
        const argument = args instanceof Array ? args : [args];
        this.#useArgs = [...argument];
        this.taskTrace.write({
            protocol: "USING",
            detail: args.length === 0 ? "not use arguments" : "use arguments",
        });
    }
    pipe(predicate) {
        this.#build.push(predicate);
        if (Issue.util.hasIn(predicate, "parent"))
            predicate.parent = this;
        this.taskTrace.write({
            protocol: "PASS",
            detail: "pipe insert",
        });
    }
    try(predicate) {
        const tryIssue = new TryIssue(predicate);
        this.#build.push(tryIssue);
        this.#trycatch.try = true;
    }
    copyCatch() {
        return this.#catch;
    }
    catch(predicate) {
        Object.assign(this, { "#catch": predicate });
        this.#trycatch.catch = true;
    }
    #catch(error) {
        this.logger.log("catch error:", error.message);
        this.taskTrace.write({
            protocol: "ERROR",
            detail: "pipe work fail: " + error,
        });
    }
    finally(predicate) {
        this.#build.push(predicate);
        this.#trycatch.finally = true;
    }
}
export class TryIssue extends Issue {
    do;
    constructor(predicate) {
        super("try");
        this.do = predicate;
    }
}
