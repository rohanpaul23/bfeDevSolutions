/**
 * Build a class name string from mixed inputs.
 *
 * Supported input types:
 * 1. string  -> include directly
 * 2. number  -> include directly
 * 3. array   -> flatten recursively and process each item
 * 4. object  -> include only own enumerable string keys whose values are truthy
 * 5. falsy values (false, null, undefined, 0, '') -> ignore
 *
 * @param {any[]} args
 * @returns {string}
 */
function classNames(...args) {
  // Final collected class names will be stored here
  const res = [];

  /**
   * Recursively process one value
   * @param {any} value
   */
  function helper(value) {
    // Ignore falsy values
    // Examples ignored:
    // false, null, undefined, 0, ''
    if (!value) return;

    // If value is a string or number,
    // it can directly become part of the class name output.
    //
    // Example:
    // "btn"   -> "btn"
    // 123     -> "123"
    if (typeof value === "string" || typeof value === "number") {
      res.push(String(value));
      return;
    }

    // If value is an array,
    // we need to process each item inside it.
    //
    // This is recursive because arrays can be nested:
    // ['a', ['b', ['c']]]
    if (Array.isArray(value)) {
      for (const item of value) {
        helper(item);
      }
      return;
    }

    // If value is an object,
    // include only keys whose values are truthy.
    //
    // IMPORTANT:
    // We use Object.keys(value) because it returns only:
    // - own keys
    // - enumerable keys
    // - string keys
    //
    // So it automatically ignores:
    // - symbol keys
    // - non-enumerable keys
    // - inherited keys
    //
    // Example:
    // { foo: true, bar: false } -> include "foo" only
    if (typeof value === "object") {
      for (const key of Object.keys(value)) {
        if (value[key]) {
          res.push(key);
        }
      }
    }
  }

  // Process every top-level argument
  for (const arg of args) {
    helper(arg);
  }

  // Join all collected class names with spaces
  return res.join(" ");
}