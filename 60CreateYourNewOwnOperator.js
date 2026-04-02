/**
 * @param {Function} constructor
 * @param {any[]} args
 */
const myNew = (constructor, ...args) => {
  // ------------------------------------------------------------
  // 1. Create a new empty object
  // ------------------------------------------------------------
  const obj = {};

  // ------------------------------------------------------------
  // 2. Link prototype
  // ------------------------------------------------------------
  // This makes:
  // obj.__proto__ === constructor.prototype
  Object.setPrototypeOf(obj, constructor.prototype);

  // ------------------------------------------------------------
  // 3. Call constructor with this = obj
  // ------------------------------------------------------------
  const result = constructor.apply(obj, args);

  // ------------------------------------------------------------
  // 4. Handle return value
  // ------------------------------------------------------------
  // If constructor returns an object → use it
  // Otherwise → use the created object
  if (result !== null && (typeof result === "object" || typeof result === "function")) {
    return result;
  }

  return obj;
};