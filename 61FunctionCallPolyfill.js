Function.prototype.mycall = function(thisArg, ...args) {
  // `this` here is the function on which mycall() was invoked.
  // Example:
  // greet.mycall(person, 25)
  // then `this` is greet
  const fn = this;

  // If thisArg is null or undefined, use the global object.
  // Otherwise convert primitives like "abc" or 123 into wrapper objects.
  thisArg = thisArg == null ? globalThis : Object(thisArg);

  // Create a unique temporary property name so we don't overwrite
  // any existing property on the object.
  const key = Symbol();

  // Temporarily attach the function to the object.
  // Now it can be called as a method of the object.
  thisArg[key] = fn;

  // Call the function as an object method.
  // Because of how JS method calls work, `this` inside fn becomes thisArg.
  const result = thisArg[key](...args);

  // Remove the temporary property after execution.
  delete thisArg[key];

  // Return whatever the original function returned.
  return result;
};