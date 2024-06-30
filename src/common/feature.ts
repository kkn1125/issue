export const isNil = (
  value: null | undefined | unknown
): value is null | undefined => value === undefined || value === null;

type ObjectHasKey<K extends string | number | symbol> = {
  [key in K]: any;
};

export function hasObjectIn<K extends string>(
  object: object,
  key: K
): object is ObjectHasKey<K> {
  return key in object;
}

export const isAsyncFunction = (func: Function | Promise<any>) => {
  const isAsyncFunc =
    func instanceof Function && func.toString().startsWith("async");
  const isPromise = func instanceof Promise;
  return isAsyncFunc || isPromise;
};
