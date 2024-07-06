import { IssueProtocol } from "../common/enum";
export class TaskTrace {
    #logLines = [];
    show() {
        return [...this.#logLines];
    }
    write({ protocol, detail }) {
        const [code, message] = IssueProtocol[protocol];
        this.#logLines.push({
            code,
            message,
            detail,
        });
    }
}
