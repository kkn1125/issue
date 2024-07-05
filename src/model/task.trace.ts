import { IssueProtocol } from "@common/enum";

type LogLine = {
  code: IssueProtocol[0];
  message: string;
  detail?: any | any[];
};
type WriteProps = {
  protocol: keyof typeof IssueProtocol;
  detail?: any | any[];
};

export class TaskTrace {
  #logLines: LogLine[] = [];

  show() {
    return [...this.#logLines];
  }

  write({ protocol, detail }: WriteProps) {
    const [code, message] = IssueProtocol[protocol];
    this.#logLines.push({
      code,
      message,
      detail,
    });
  }
}
