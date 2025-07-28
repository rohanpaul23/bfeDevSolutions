/**
 * Performs an immutable update on an object or array,
 * according to a “command” specification.
 *
 * @param {Object|Array} data    The original data (object or array)
 * @param {Object}        command A command object describing the updates
 * @returns {Object|Array}        A new data structure with updates applied
 */
function update(data, command) {
  // Ensure we only operate on objects or arrays
  if (typeof data !== 'object' && !Array.isArray(data)) {
    throw new Error('update: first argument must be an object or array');
  }

  // Shallow‐copy the root so we don’t mutate the original
  // - For arrays: create a new array with the same elements
  // - For objects: create a new object with the same own properties
  let copiedData = Array.isArray(data)
    ? [...data]
    : { ...data };

  // Apply the nested updates
  _update(copiedData, command);

  // Return the new, updated copy
  return copiedData;
}

/**
 * Recursively walks the command object and applies updates
 * to `data` in place (but `data` itself is already a shallow copy).
 *
 * Supported commands under each key:
 *   - $push  : append items to an array
 *   - $set   : replace a value
 *   - $apply : transform a value via function
 *   - $merge : shallow‐merge into an object
 *
 * You can also nest commands to update deep paths.
 *
 * @param {Object|Array} data    The (copied) data to mutate here
 * @param {Object}        command The command spec for this level
 */
function _update(data, command) {
  for (const key in command) {
    // 1) $push: append elements into an array
    if (
      key === '$push' &&
      Array.isArray(command.$push) &&
      Array.isArray(data)
    ) {
      data.push(...command.$push);
      return; // done with this command
    }

    // 2) $set: replace a property or array index
    if (
      typeof command[key] === 'object' &&
      command[key].hasOwnProperty('$set')
    ) {
      data[key] = command[key].$set;
      return; // stop further processing at this branch
    }

    // 3) $apply: apply a function to existing value (array‐specific here)
    if (
      typeof command[key] === 'object' &&
      command[key].hasOwnProperty('$apply') &&
      Array.isArray(data)
    ) {
      // Only apply if the index/key exists
      if (data[key] !== undefined) {
        data[key] = command[key].$apply(data[key]);
        return;
      }
    }

    // 4) $merge: shallow‐merge an object into data[key]
    if (
      typeof command[key] === 'object' &&
      command[key].hasOwnProperty('$merge')
    ) {
      // Only valid if target is already an object
      if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = {
          ...data[key],
          ...command[key].$merge,
        };
        return;
      } else {
        throw new Error('update: cannot merge into non‐object');
      }
    }

    // 5) Nested commands: descend into object property or array index
    if (typeof command[key] === 'object') {
      // e.g. command = { user: { stats: { $set: {...} } } }
      _update(data[key], command[key]);
      // no return here, in case there are multiple sibling keys
    }
  }
}
