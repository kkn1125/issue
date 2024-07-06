export class Test {
    args = {};
    constructor(inject) {
        Object.entries(inject).forEach(([key, value]) => {
            this.args[key] = value;
        });
    }
}
