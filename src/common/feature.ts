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
