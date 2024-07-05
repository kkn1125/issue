import { LogLevel } from "@common/enum";
import { format } from "@lib/format";

export class Logger {
  context: string;

  log!: (message: unknown, ...optionalMessages: unknown[]) => void;
  info!: (message: unknown, ...optionalMessages: unknown[]) => void;
  warn!: (message: unknown, ...optionalMessages: unknown[]) => void;
  error!: (message: unknown, ...optionalMessages: unknown[]) => void;
  debug!: (message: unknown, ...optionalMessages: unknown[]) => void;

  constructor();
  constructor(context: string);
  constructor(context: object);
  constructor(context?: string | object) {
    if (typeof context === "string") {
      this.context = context;
    } else if (typeof context === "object") {
      this.context = context.constructor.name;
    } else {
      this.context = "System";
    }
    this.update();
  }

  setContext(): void;
  setContext(context: string): void;
  setContext(context: object): void;
  setContext(context?: string | object) {
    if (typeof context === "string") {
      this.context = context;
    } else if (typeof context === "object") {
      this.context = context.constructor.name;
    } else {
      this.context = "System";
    }
    this.update();
  }

  private update() {
    for (const level in LogLevel) {
      const self = this;
      Object.assign(this, {
        get [level.toLowerCase()]() {
          return console.log.bind(
            self,
            `${LogLevel[level as keyof typeof LogLevel].Sign} [${
              self.timestamp
            }] [${self.context}]  ${
              LogLevel[level as keyof typeof LogLevel].Label
            } ---`
          );
        },
      });
    }
  }

  get timestamp() {
    return format(new Date(), "HH:mm:ss.SSS");
  }
}
