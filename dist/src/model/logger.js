import { LogLevel } from "../common/enum";
import { format } from "../lib/format";
import { Issue } from "./issue";
export class Logger {
    #mode = Issue.mode;
    context;
    log;
    info;
    warn;
    error;
    debug;
    constructor(context) {
        if (typeof context === "string") {
            this.context = context;
        }
        else if (typeof context === "object") {
            this.context = context.constructor.name;
        }
        else {
            this.context = "System";
        }
        this.update();
    }
    setContext(context) {
        if (typeof context === "string") {
            this.context = context;
        }
        else if (typeof context === "object") {
            this.context = context.constructor.name;
        }
        else {
            this.context = "System";
        }
        this.update();
    }
    update() {
        for (const level in LogLevel) {
            const self = this;
            Object.assign(this, {
                get [level.toLowerCase()]() {
                    if (self.#mode === "development") {
                        return console.log.bind(self, `${LogLevel[level].Sign} [${self.timestamp}] [${self.context}]  ${LogLevel[level].Label} ---`);
                    }
                    return () => { };
                },
            });
        }
    }
    get timestamp() {
        return format(new Date(), "HH:mm:ss.SSS");
    }
}
