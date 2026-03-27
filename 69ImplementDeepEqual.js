/**
 * Deep equality check between two values.
 *
 * What this function tries to do:
 * - return true when two primitive values are the same
 * - return true when two objects/arrays have the same structure and values
 * - support nested objects
 * - avoid infinite recursion for circular references
 *
 * Note:
 * This version compares keys in the exact order returned by Reflect.ownKeys().
 * So if two objects have the same keys/values but a different key insertion order,
 * this function may return false.
 */
function isEqual(a, b, map = new Map()) {
    // ------------------------------------------------------------
    // 1. Fastest base case: strict equality
    // ------------------------------------------------------------
    // If a and b are exactly the same value, return true immediately.
    //
    // This covers:
    // - same primitive values:
    //     1 === 1
    //     "hi" === "hi"
    //     true === true
    //
    // - same object reference:
    //     const obj = { x: 1 };
    //     isEqual(obj, obj) --> true
    //
    // Why this check is useful:
    // It avoids unnecessary recursion for the most common easy cases.
    if (a === b) return true;

    // ------------------------------------------------------------
    // 2. If either value is not an object, they cannot be deeply equal
    //    at this point
    // ------------------------------------------------------------
    // We already know a !== b from the first check.
    //
    // So if one or both are primitive values now, they are different.
    //
    // Example:
    //   isEqual(1, 2) --> false
    //   isEqual("a", "b") --> false
    //
    // Important caveat:
    // typeof null === "object" in JavaScript.
    // So null is not filtered out here, which means this implementation
    // can break for cases involving null.
    //
    // Example problematic case:
    //   isEqual(null, {}) --> Reflect.ownKeys(null) would throw later
    if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }

    // ------------------------------------------------------------
    // 3. Circular reference protection
    // ------------------------------------------------------------
    // This is the most important advanced part of the function.
    //
    // Problem:
    // Some objects point back to themselves, directly or indirectly.
    //
    // Example:
    //   const obj1 = {};
    //   obj1.self = obj1;
    //
    //   const obj2 = {};
    //   obj2.self = obj2;
    //
    // If we recursively compare obj1.self and obj2.self,
    // we are really comparing obj1 and obj2 again.
    // Without protection, recursion would never stop.
    //
    // The map stores pairs we have already started comparing:
    //   map.set(a, b)
    //
    // Meaning:
    //   "I have already compared / started comparing object a with object b"
    //
    // So if we encounter the same pair again, we return true immediately
    // and do not recurse forever.
    //
    // Why both checks?
    //   map.has(a)           --> have we seen object a before?
    //   map.get(a) === b     --> was it paired with this exact object b?
    //
    // If yes, then we have looped back to an already-known comparison pair.
    if (map.has(a) && map.get(a) === b) return true;

    // Record the current pair before going deeper.
    // This is what makes circular reference handling work.
    map.set(a, b);

    // ------------------------------------------------------------
    // 4. Get all own property keys from both objects
    // ------------------------------------------------------------
    // Reflect.ownKeys() returns ALL own keys:
    // - normal string keys
    // - non-enumerable keys
    // - symbol keys
    //
    // Example:
    //   const sym = Symbol("id");
    //   const obj = { name: "Rohan" };
    //   Object.defineProperty(obj, "hidden", { value: 123, enumerable: false });
    //   obj[sym] = "secret";
    //
    //   Reflect.ownKeys(obj)
    //   --> ["name", "hidden", Symbol(id)]
    //
    // "own keys" means:
    // only keys directly on the object,
    // not inherited keys from the prototype chain.
    let keysA = Reflect.ownKeys(a);
    let keysB = Reflect.ownKeys(b);

    // ------------------------------------------------------------
    // 5. If number of keys differs, objects cannot be equal
    // ------------------------------------------------------------
    // Example:
    //   { x: 1 } vs { x: 1, y: 2 } --> false
    if (keysA.length !== keysB.length) {
        return false;
    }

    // ------------------------------------------------------------
    // 6. Compare keys and corresponding values one by one
    // ------------------------------------------------------------
    // This loop does the actual deep comparison.
    for (let i = 0; i < keysA.length; i++) {
        // --------------------------------------------------------
        // 6a. Compare key names at the same position
        // --------------------------------------------------------
        // If the key names differ, the objects are not equal.
        //
        // Example:
        //   { a: 1 } vs { b: 1 } --> false
        //
        // Important:
        // This implementation is order-sensitive.
        // It expects keysA and keysB to appear in the same order.
        //
        // So these may fail:
        //   const obj1 = { x: 1, y: 2 };
        //   const obj2 = { y: 2, x: 1 };
        //
        // Even if logically they contain the same data,
        // different insertion order may produce different key order.
        //
        // --------------------------------------------------------
        // 6b. Recursively compare the values stored under those keys
        // --------------------------------------------------------
        // If the keys match, we then compare the corresponding values.
        //
        // Example:
        //   { user: { age: 20 } }
        //   { user: { age: 20 } }
        //
        // First compare key "user", then recursively compare:
        //   { age: 20 } and { age: 20 }
        //
        // The same map is passed down into recursion so circular reference
        // tracking works across the full object graph.
        if (keysA[i] !== keysB[i] || !isEqual(a[keysA[i]], b[keysB[i]], map)) {
            return false;
        }
    }

    // ------------------------------------------------------------
    // 7. If nothing failed, the values are deeply equal
    // ------------------------------------------------------------
    // That means:
    // - same number of keys
    // - keys matched
    // - all nested values matched
    return true;
}