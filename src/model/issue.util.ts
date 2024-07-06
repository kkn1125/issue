type RandomValueProps = {
  min?: number;
  max?: number;
};

type HasKey<K extends string | number | symbol> = {
  [k in K]: any;
};
export class Util {
  hasIn<K extends string>(obj: object, key: K): obj is HasKey<K> {
    return key in obj;
  }

  safeDiv(a: number, b: number) {
    const div = a / b;
    const isInfinity = !Number.isFinite(div);
    const isNaN = Number.isNaN(div);
    return isInfinity || isNaN ? 0 : div;
  }

  makeRandomValue(props?: RandomValueProps) {
    const min = props?.min ?? 0;
    const max = props?.max ?? 10;
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}

// const arr = [1, true, "hello"];

// type El<T> = T extends (infer E)[] ? E : never;

// const element: El<typeof arr> = true;

// type Arg<T> = T extends infer R ? R : never;

// const test = new Test(inject);
// // test.args = { test: 1 };
// console.log(test.args.name);
// console.log(test.args.hobby === "guitar");
// console.log(test.args);
