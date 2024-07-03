// interface BaseLogger {
//   log(message?: unknown, ...optionalParams: unknown[]): void;
//   info(message?: unknown, ...optionalParams: unknown[]): void;
//   debug(message?: unknown, ...optionalParams: unknown[]): void;
//   warn(message?: unknown, ...optionalParams: unknown[]): void;
//   error(message?: unknown, ...optionalParams: unknown[]): void;
// }

import { format } from "@lib/format";

export const LogLevel = {
  Log: {
    Label: "LOG",
    Sign: "🪵",
  },
  Info: {
    Label: "INFO",
    Sign: "✨",
  },
  Debug: {
    Label: "DEBUG",
    Sign: "🐛",
  },
  Warn: {
    Label: "WARN",
    Sign: "⚠️",
  },
  Error: {
    Label: "ERROR",
    Sign: "🔥",
  },
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export class Logger /* implements BaseLogger */ {
  context: string;

  log!: (message: unknown, ...optionalMessages: unknown[]) => void;

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
            `${LogLevel.Log.Sign} [${self.timestamp}] [${self.context}]  ${LogLevel.Log.Label} ---`
          );
        },
      });
    }
  }

  get timestamp() {
    return format(new Date(), "HH:mm:ss.SSS");
  }
}
