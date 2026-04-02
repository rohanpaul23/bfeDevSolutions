/**
 * Polyfill-like implementation of Object.assign
 *
 * Copies enumerable own properties (string + symbol) from source objects
 * into the target object.
 *
 * NOTE:
 * - This copies VALUES, not property descriptors
 * - Getters are executed, not preserved
 * - Later sources override earlier ones
 *
 * @param {any} target - The object to copy properties into
 * @param  {...any} sources - One or more source objects
 * @returns {Object} - The modified target object
 */
function objectAssign(target, ...sources) {

  // 🛑 Step 1: Validate target
  // -------------------------------------------------------
  // target cannot be null or undefined because:
  // - they cannot be converted into objects
  // - assigning properties to them would crash
  //
  // Example:
  // Object.assign(null, { a: 1 }) → throws error
  if (target === null || target === undefined) {
    throw Error();
  }

  // 🧠 Step 2: Convert target into an object
  // -------------------------------------------------------
  // If target is already an object → unchanged
  // If primitive (string, number, boolean) → wrapped into object
  //
  // Example:
  // Object("abc") → String object wrapper
  // Object(42)    → Number object wrapper
  //
  // Why needed?
  // Because properties can only be assigned to objects
  target = Object(target);

  // 🔁 Step 3: Iterate over all source objects
  // -------------------------------------------------------
  // Each source is processed in order
  // Later sources override earlier ones
  //
  // Example:
  // objectAssign({}, {a:1}, {a:2}) → {a:2}
  for (let source of sources) {

    // 🛑 Step 4: Skip null or undefined sources
    // -------------------------------------------------------
    // Using `== null` covers BOTH:
    // - null
    // - undefined
    //
    // Why skip?
    // Because:
    // Object.keys(null) → ❌ error
    if (source == null) continue;

    // 🧠 Step 5: Collect ALL keys from source
    // -------------------------------------------------------
    // Object.assign copies:
    // ✔ enumerable string keys
    // ✔ enumerable symbol keys
    //
    // Object.keys(source):
    //   → returns enumerable string keys
    //
    // Object.getOwnPropertySymbols(source):
    //   → returns symbol keys
    //
    // Combine both to match native behavior
    const allKeys = [
      ...Object.keys(source),
      ...Object.getOwnPropertySymbols(source)
    ];

    // 🔁 Step 6: Copy each property
    // -------------------------------------------------------
    for (let key of allKeys) {

      // 🧠 Step 6.1: Read value from source and assign to target
      //
      // IMPORTANT:
      // - This triggers getters (if present)
      // - It copies VALUE, not descriptor
      //
      // Example:
      // const source = {
      //   get x() { return 10; }
      // };
      //
      // target.x = source.x → getter runs → value 10 stored
      //
      // Getter is NOT preserved ❗
      target[key] = source[key];

      // 🧪 Step 6.2: Verify assignment succeeded
      // -------------------------------------------------------
      // Why needed?
      // Some assignments can fail silently (non-strict mode)
      //
      // Example:
      // target has non-writable property:
      //
      // Object.defineProperty(target, "x", {
      //   value: 1,
      //   writable: false
      // });
      //
      // source = { x: 10 }
      //
      // target.x = 10 → fails silently
      //
      // So we check:
      // if assignment didn't actually change value → throw error
      if (target[key] !== source[key]) {
        throw Error();
      }
    }
  }

  // ✅ Step 7: Return the modified target
  // -------------------------------------------------------
  // Matches behavior of Object.assign
  return target;
}