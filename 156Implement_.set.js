// ---------------------------------------------
// Checks whether a path segment should be treated
// as a valid array index.
//
// Valid:
//   "0", "1", "2", "10"
//
// Invalid (treated as object keys):
//   "01", "001", "-1", "1.5", "abc"
// ---------------------------------------------
const isValidArrayIndexSegment = (seg: string): boolean =>
  /^(0|[1-9]\d*)$/.test(seg);

// ---------------------------------------------
// Converts any supported path format into
// a normalized array of string segments.
//
// Examples:
//   "a.b.c[1]"   → ["a", "b", "c", "1"]
//   "a.c.d.01"   → ["a", "c", "d", "01"]
//   ["a","b"]    → ["a", "b"]
// ---------------------------------------------
function toPath(path: string | string[]): string[] {
  // If the path is already an array, ensure
  // all segments are strings and return it.
  if (Array.isArray(path)) return path.map(String);

  // Convert bracket notation to dot notation
  // Example:
  //   "a.b.c[1]" → "a.b.c.1"
  const normalized = path.replace(/\[(.+?)\]/g, ".$1");

  // Split by dots and remove empty segments
  // Example:
  //   ".a..b." → ["a", "b"]
  return normalized.split(".").filter(Boolean);
}

// ---------------------------------------------
// Checks if a value can act as a container
// we can traverse into (object / array / function)
//
// Rejects:
//   null, undefined, numbers, strings, booleans
// ---------------------------------------------
function isObjectLike(v: any): v is object {
  return v !== null && (typeof v === "object" || typeof v === "function");
}

// ---------------------------------------------
// set(obj, path, value)
//
// Mutates `obj` by assigning `value` at `path`.
// Creates missing objects / arrays on the fly,
// choosing the correct type based on the *next*
// path segment.
// ---------------------------------------------
function set<T extends object>(
  obj: T,
  path: string | string[],
  value: any
): void {
  // Normalize path into array form
  const parts = toPath(path);

  // If path is empty, nothing to set
  if (parts.length === 0) return;

  // `curr` always points to the current container
  // as we walk down the object
  let curr: any = obj;

  // Walk through each path segment
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];

    // Check if this is the final segment
    const isLast = i === parts.length - 1;

    // -----------------------------------------
    // CASE 1: Final segment → perform assignment
    // -----------------------------------------
    if (isLast) {
      // If the current container is an array
      // AND the key is a valid numeric index,
      // write using a numeric index
      if (Array.isArray(curr) && isValidArrayIndexSegment(key)) {
        curr[Number(key)] = value;
      } else {
        // Otherwise, treat it as a normal
        // object property
        curr[key] = value;
      }

      // Assignment complete, stop traversal
      return;
    }

    // -----------------------------------------
    // CASE 2: Intermediate segment
    // Ensure the next container exists
    // -----------------------------------------

    // Look ahead to the next path segment
    const nextKey = parts[i + 1];

    // Decide whether the next container
    // should be an array or an object
    const shouldCreateArrayNext = isValidArrayIndexSegment(nextKey);

    // If the current container itself is an array
    // and the current key is a valid index,
    // access it numerically (curr[0] instead of curr["0"])
    const currIsArrayIndex =
      Array.isArray(curr) && isValidArrayIndexSegment(key);

    // Determine how to access the current property
    const accessKey = currIsArrayIndex ? Number(key) : key;

    // Grab the existing value at this path (if any)
    const existing = curr[accessKey];

    // -----------------------------------------
    // If the property does not exist OR
    // exists but is not object-like,
    // we must create a new container
    // -----------------------------------------
    if (!isObjectLike(existing)) {
      // Create array or object depending on
      // the *next* path segment
      curr[accessKey] = shouldCreateArrayNext ? [] : {};
    } else {
      // ---------------------------------------
      // If a container exists but is the
      // wrong type, replace it
      // ---------------------------------------

      // Next segment expects an array,
      // but existing value is not an array
      if (shouldCreateArrayNext && !Array.isArray(existing)) {
        curr[accessKey] = [];
      }

      // Next segment expects an object,
      // but existing value is an array
      if (!shouldCreateArrayNext && Array.isArray(existing)) {
        curr[accessKey] = {};
      }
    }

    // Move the pointer deeper into the object
    curr = curr[accessKey];
  }
}
