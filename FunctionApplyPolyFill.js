Function.prototype.myapply = function(thisArg, argsArray) {
  const fn = this;

  // Step 1: handle null/undefined
  thisArg = thisArg == null ? globalThis : Object(thisArg);

  // Step 2: unique key to avoid overwrite
  const uniqueKey = Symbol();

  // Step 3: attach function
  thisArg[uniqueKey] = fn;

  // Step 4: call with spread args
  const result = argsArray ? thisArg[uniqueKey](...argsArray) : thisArg[uniqueKey]();

  // Step 5: cleanup
  delete thisArg[uniqueKey];

  return result;
};