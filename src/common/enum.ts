export type LogOption = {
  Label: "LOG" | "INFO" | "DEBUG" | "WARN" | "ERROR";
  Sign: "🪵" | "✨" | "🐛" | "⚠️" | "🔥";
};
export type LogLevelOptions = {
  [k in "Log" | "Info" | "Debug" | "Warn" | "Error"]: LogOption;
};
export const LogLevel: LogLevelOptions = {
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

export const IssueProtocol = {
  OK: [100, "ok"],
  DONE: [101, "done"],
  PASS: [102, "pass"],
  SOLVING: [103, "solving"],
  ASYNC_SOLVING: [104, "async solving"],
  TIMESTAMP: [105, "timestamp"],
  DOING: [106, "doing"],

  CREATED: [200, "created"],
  UPDATED: [201, "updated"],
  DELETED: [202, "deleted"],

  EMPTY: [300, "empty"],
  WRONG_VALUE: [301, "wrong value"],
  UNKNOWN: [302, "unknown"],
  NULL: [303, "null"],
  UNDEFINED: [304, "undefined"],
  RETURN: [305, "return"],
  NO_RETURN: [306, "no return"],

  NOT_FOUND: [400, "not found"],
  NOT_WORK: [401, "not work"],
  OUT: [402, "out"],
  IGNORE: [403, "ignore"],
  INCLUDE: [404, "include"],
  EXCLUDE: [405, "exclude"],
  USING: [406, "using"],

  ERROR: [1000, "error"],
  FATAL: [1001, "fatal"],
} as const;
export type IssueProtocol = (typeof IssueProtocol)[keyof typeof IssueProtocol];
