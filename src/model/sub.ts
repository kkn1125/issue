type El<T> = T extends infer R ? R : never;

export class Test<T extends object> {
  args: El<T> = {} as El<T>;

  constructor(inject: T) {
    Object.entries(inject).forEach(([key, value]) => {
      this.args[key as keyof El<T>] = value;
    });
  }
  // _args: Record<string, any> = {};
  // args: Arg<typeof this._args> = {};
  // addArg<T extends object>(key: keyof T, value: T[keyof T]) {
  //   this._args[key] = value;
  // }
}
