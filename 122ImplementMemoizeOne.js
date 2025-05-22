function defaultIsEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item === b[i]);
}
function memoizeOne(func, isEqual = defaultIsEqual) {
  let lastArgs = [];
  let prevContext = null;
  let lastResult = null;

  return function (...args) {
    if (prevContext === this && isEqual(lastArgs, args)) {
      return lastResult;
    }
    lastResult = func.apply(this, args);
    lastArgs = args;
    prevContext = this;
    return lastResult;
  };
}
