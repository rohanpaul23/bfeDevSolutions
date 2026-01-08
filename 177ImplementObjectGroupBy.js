function ObjectGroupBy<T, K extends keyof any>(
  items: Array<T>,
  callback: (item: T) => K
): Record<K, Array<T>> {
  // Validate that the first argument is actually an array.
  if (!Array.isArray(items)) {
    throw new TypeError("First argument must be an array");
  }

  // Validate that the callback is a function. This function determines the group key.
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  /**
   * Create the result object with a null prototype.
   *
   * Why?
   * - We don't want inherited properties like "toString", "constructor", etc.
   * - Some tests expect the final grouped object to have no prototype:
   *     Object.getPrototypeOf(result) === null
   * - It also avoids accidental key collisions with built-in object properties.
   */
  const res = Object.create(null) as Record<K, Array<T>>;

  // Loop through every item in the input array
  for (const item of items) {
    // Compute the group key for this item using the callback
    const key = callback(item); // key may be string | number | symbol

    /**
     * If a group already exists for this key, push the item into it.
     * If not, create a new group (array) with this item as the first element.
     *
     * res[key] works fine even with null prototype objects.
     */
    if (res[key]) {
      res[key].push(item);
    } else {
      res[key] = [item];
    }
  }

  // Return the object where each key maps to an array of grouped items
  return res;
}
