
/**
 * @param {any} proto
 * @return {object}
 */
function myObjectCreate(proto) {
  // Step 1: Check if proto is a valid object (non-null)
  if (typeof proto !== 'object' || proto === null) {
    throw new TypeError('Prototype must be a non-null object');
  }

  // Step 2: Define a dummy constructor
  function Temp() {}

  // Step 3: Set its prototype
  Temp.prototype = proto;

  // Step 4: Return a new object that inherits from proto
  return new Temp();
}