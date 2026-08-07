/**
 * Safely gets a nested value from an object/array using a path.
 *
 * Supported path formats:
 * 1. String with dots:
 *    get(obj, 'a.b.c')
 *
 * 2. String with array index notation:
 *    get(obj, 'a.b.c[1]')
 *
 * 3. Array of keys:
 *    get(obj, ['a', 'b', 'c', '1'])
 *
 * If the path cannot be fully resolved, it returns defaultValue.
 *
 * @param {object} source - The original object/array we want to read from
 * @param {string | string[]} path - The path describing where the value is
 * @param {any} [defaultValue=undefined] - Value to return if path is invalid or final value is undefined
 * @return {any}
 */
function get(source, path, defaultValue = undefined) {
  // If source itself is null or undefined,
  // we cannot read anything from it.
  // Example:
  // get(null, 'a.b', 'x') -> 'x'
  if (source == null) return defaultValue;

  // We will convert the path into an array of keys.
  // Example:
  // 'a.b.c[1]' -> ['a', 'b', 'c', '1']
  // ['a', 'b', 'c', '1'] stays the same
  let pathKeys;

  // If path is already an array, we do not need to parse it.
  // We can use it directly.
  if (Array.isArray(path)) {
    pathKeys = path;
  } else {
    // If path is a string, we need to break it into keys manually.
    // We cannot just split by '.' because the path may also contain [index].
    //
    // Example:
    // 'a.b.c[10]' should become ['a', 'b', 'c', '10']
    pathKeys = [];

    // current stores the token we are currently building.
    // Think of it as a temporary "word".
    //
    // Example while parsing 'a.b.c[10]':
    // current becomes:
    // 'a' -> then pushed
    // 'b' -> then pushed
    // 'c' -> then pushed
    // '1' -> '10' -> then pushed
    let current = '';

    // Loop through each character of the path string one by one.
    for (let i = 0; i < path.length; i++) {
      const char = path[i];

      // '.', '[' and ']' are separators.
      // They mark the end of the current token.
      //
      // Example:
      // In 'a.b', '.' tells us token 'a' is complete.
      // In 'c[10]', '[' tells us token 'c' is complete.
      // In '[10]', ']' tells us token '10' is complete.
      if (char === '.' || char === '[' || char === ']') {
        // Push only if current is not empty.
        //
        // Why this check?
        // Because separators can appear when no token is being built.
        // We do NOT want to push empty strings.
        //
        // Example:
        // if current = '', pushing it would create invalid keys like ''
        //
        // Example:
        // 'a[1]' :
        // after pushing 'a', current becomes ''
        // when we later see ']', we only want to push '1',
        // not an empty string before/after it
        if (current.length > 0) {
          pathKeys.push(current);
          current = '';
        }
      } else {
        // If the character is not a separator,
        // it is part of the current key/index.
        //
        // Example:
        // for '10':
        // first '1' -> current = '1'
        // then '0' -> current = '10'
        //
        // We are building the full token until we hit a separator.
        current += char;
      }
    }

    // After the loop ends, there may still be a token left in current
    // that has not been pushed yet.
    //
    // Example:
    // path = 'a.b.c'
    // The loop ends after reading 'c'
    // Since there is no separator after 'c',
    // we must push it manually here.
    if (current.length > 0) {
      pathKeys.push(current);
    }
  }

  // Now we traverse the source object using the keys in pathKeys.
  //
  // Example:
  // source = { a: { b: { c: [1,2,3] } } }
  // pathKeys = ['a', 'b', 'c', '1']
  //
  // Flow:
  // current = source
  // current = current['a']
  // current = current['b']
  // current = current['c']
  // current = current['1']
  let current = source;

  // Go through each key one by one
  for (const key of pathKeys) {
    // If current becomes null or undefined before finishing the path,
    // the path is invalid / broken.
    //
    // Example:
    // source = { a: {} }
    // path = 'a.b.c'
    //
    // after current = current['a'], current is {}
    // then current = current['b'] gives undefined
    // next iteration should return defaultValue safely
    if (current == null) {
      return defaultValue;
    }

    // Move one step deeper into the object/array
    current = current[key];
  }

  // If the final resolved value is undefined,
  // return defaultValue instead.
  //
  // Example:
  // get({ a: {} }, 'a.b', 'fallback') -> 'fallback'
  //
  // But if final value is something valid like 0, false, or null,
  // this line behaves as follows:
  // - 0 stays 0
  // - false stays false
  // - null stays null
  // Only undefined triggers defaultValue here.
  return current === undefined ? defaultValue : current;
}