/**
 * Remove duplicates from the array in place.
 *
 * Important behavior:
 * This follows JavaScript Set behavior.
 *
 * That means:
 * - primitive duplicates are removed
 * - object duplicates are removed only if they are the same reference
 *
 * Example:
 *   const x = {};
 *   deduplicate([x, x])      --> keeps one x
 *   deduplicate([{}, {}])    --> keeps both, because these are different objects
 *
 * @param {any[]} arr
 */
function deduplicate(arr) {
  // ------------------------------------------------------------
  // 1. Create a Set from the array
  // ------------------------------------------------------------
  // A Set stores only unique values.
  //
  // JavaScript Set uses "SameValueZero" style comparison:
  // - 1 and 1 are considered the same
  // - "a" and "a" are considered the same
  // - true and true are considered the same
  // - NaN and NaN are considered the same
  // - object values are considered the same ONLY if they are
  //   the exact same reference
  //
  // Example:
  //   const obj = {};
  //   new Set([obj, obj]) --> size 1
  //
  //   new Set([{}, {}])   --> size 2
  // because those are two different object references in memory.
  const unique = new Set(arr);

  // ------------------------------------------------------------
  // 2. Clear the original array in place
  // ------------------------------------------------------------
  // We are required to modify the original array itself.
  //
  // This is important:
  //   arr = [...unique]
  // would NOT modify the original array object outside the function.
  //
  // But setting arr.length = 0 empties the same array object in place.
  arr.length = 0;

  // ------------------------------------------------------------
  // 3. Put the unique values back into the same array
  // ------------------------------------------------------------
  // We iterate over the Set and push each unique value back.
  //
  // After this, "arr" is still the same original array object,
  // but now it contains only unique values.
  for (const item of unique) {
    arr.push(item);
  }
}