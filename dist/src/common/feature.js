export const isNil = (value) => value === undefined || value === null;
export function hasObjectIn(object, key) {
    return key in object;
}
export const isAsyncFunction = (func) => {
    const isAsyncFunc = func instanceof Function && func.toString().startsWith("async");
    const isPromise = func instanceof Promise;
    return isAsyncFunc || isPromise;
};
