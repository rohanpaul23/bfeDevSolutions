/**
 * Deep clone function
 *
 * Goal:
 * - Create a completely new copy of the input (data)
 * - Handle nested objects and arrays
 * - Handle circular references
 * - Preserve symbol properties
 */
function cloneDeep(data) {

  // ------------------------------------------------------------
  // Map is used to store already cloned objects
  // Key   -> original object
  // Value -> cloned object
  //
  // Why?
  // 1. Prevent infinite recursion for circular references
  // 2. Preserve shared references
  // ------------------------------------------------------------
  const map = new Map();

  /**
   * Recursive helper function
   *
   * @param {any} val - current value to clone
   * @param {Map} map - reference tracking map
   */
  function clone(val, map) {

    // ------------------------------------------------------------
    // 1. Base case: primitive values
    // ------------------------------------------------------------
    // If val is:
    // - number, string, boolean, undefined, symbol, bigint
    // - OR null
    //
    // Then we just return it directly.
    //
    // Why?
    // Primitives are immutable → no need to clone deeply
    // ------------------------------------------------------------
    if (val === null || typeof val !== 'object') {
      return val;
    }

    // ------------------------------------------------------------
    // 2. Circular reference / already cloned check
    // ------------------------------------------------------------
    // If we've already cloned this object before,
    // return the existing clone instead of cloning again.
    //
    // Example:
    // const obj = {};
    // obj.self = obj;
    //
    // Without this, recursion would go forever.
    // ------------------------------------------------------------
    if (map.has(val)) {
      return map.get(val);
    }

    // ------------------------------------------------------------
    // 3. Create a new empty container
    // ------------------------------------------------------------
    // If input is an array → create []
    // Otherwise → create {}
    //
    // This ensures type is preserved.
    // ------------------------------------------------------------
    const output = Array.isArray(val) ? [] : {};

    // ------------------------------------------------------------
    // 4. Store mapping BEFORE recursion
    // ------------------------------------------------------------
    // IMPORTANT:
    // We must store the mapping BEFORE cloning children.
    //
    // Why?
    // Because children might point back to parent (circular case)
    //
    // Example:
    // obj.self = obj
    //
    // If we don't store early → infinite recursion
    // ------------------------------------------------------------
    map.set(val, output);

    // ------------------------------------------------------------
    // 5. Collect all keys (string + symbol)
    // ------------------------------------------------------------
    // Object.keys(val)
    //   → only enumerable string keys
    //
    // Object.getOwnPropertySymbols(val)
    //   → only symbol keys
    //
    // We combine both to ensure nothing is missed.
    // ------------------------------------------------------------
    const keys = [
      ...Object.getOwnPropertySymbols(val),
      ...Object.keys(val)
    ];

    // ------------------------------------------------------------
    // 6. Recursively clone each property
    // ------------------------------------------------------------
    // For every key:
    // 1. Get the value
    // 2. Recursively clone it
    // 3. Assign to output
    //
    // This is where deep cloning actually happens.
    // ------------------------------------------------------------
    for (let key of keys) {
      output[key] = clone(val[key], map);
    }

    // ------------------------------------------------------------
    // 7. Return the fully cloned object/array
    // ------------------------------------------------------------
    return output;
  }

  // ------------------------------------------------------------
  // Start cloning from the root input
  // ------------------------------------------------------------
  return clone(data, map);
}