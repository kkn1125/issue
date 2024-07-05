type RandomValueProps = {
  min?: number;
  max?: number;
};

export class Util {
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
