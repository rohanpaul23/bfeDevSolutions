/**
 * set(obj, path, value)
 *
 * Set a value inside an object using a path.
 *
 * Path can be:
 *  - "a.b.c"
 *  - "a.b.c[0]"
 *  - ["a","b","c","2"]
 *
 * Rules:
 *  - create missing objects / arrays
 *  - valid numbers → array index
 *  - invalid numbers like "01" → string key
 *  - modify object in-place
 */

function set<T extends object>(
  obj: T,
  path: string | string[],
  value: any
) {
  // Convert path into array of keys
  // "a.b.c[1]" → ["a","b","c","1"]
  const keys = Array.isArray(path) ? path : parsePath(path);

  // Start from root object
  let current: any = obj;

  // Traverse keys one by one
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Check if this is last key in path
    const isLast = i === keys.length - 1;

    // If last key → set value
    if (isLast) {
      current[key] = value;
      return obj;
    }

    // If key does not exist → create it
    if (current[key] == null) {

      // Look at next key to decide
      // whether to create object or array
      const nextKey = keys[i + 1];

      // If next key is valid array index → create array
      if (isArrayIndex(nextKey)) {
        current[key] = [];
      } else {
        // Otherwise create object
        current[key] = {};
      }
    }

    // Move deeper
    current = current[key];
  }

  return obj;
}


/**
 * Convert string path into array of keys
 *
 * Examples:
 *  "a.b.c" → ["a","b","c"]
 *  "a.b.c[1]" → ["a","b","c","1"]
 *  "a.c.d.01" → ["a","c","d","01"]
 */
function parsePath(path: string): string[] {

  const result: string[] = [];

  let token = "";

  for (let i = 0; i < path.length; i++) {

    const ch = path[i];

    // Dot means new key
    if (ch === ".") {
      if (token) {
        result.push(token);
        token = "";
      }
    }

    // Bracket start → read until ]
    else if (ch === "[") {

      // push previous token if exists
      if (token) {
        result.push(token);
        token = "";
      }

      let j = i + 1;
      let bracketValue = "";

      // read number inside []
      while (j < path.length && path[j] !== "]") {
        bracketValue += path[j];
        j++;
      }

      result.push(bracketValue);

      // skip to closing bracket
      i = j;
    }

    // normal character
    else {
      token += ch;
    }
  }

  // push last token if exists
  if (token) {
    result.push(token);
  }

  return result;
}


/**
 * Check if key is valid array index
 *
 * Valid:
 *  "0"
 *  "1"
 *  "2"
 *
 * Invalid:
 *  "01"
 *  "001"
 *  "1a"
 */
function isArrayIndex(key: string): boolean {
  return String(Number(key)) === key;
}