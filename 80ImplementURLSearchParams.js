class MyURLSearchParams {
  /**
   * Constructor accepts query string
   * Example:
   *  "a=1&b=2&a=3&name=rohan+paul"
   *
   * We store params internally as:
   * [
   *   ["a", "1"],
   *   ["b", "2"],
   *   ["a", "3"],
   *   ["name", "rohan paul"]
   * ]
   *
   * Why array of pairs?
   * Because URLSearchParams allows duplicate keys
   */
  constructor(init = "") {
    // Internal storage for key/value pairs
    this.params = [];

    // Only string allowed for this simplified version
    if (typeof init !== "string") {
      throw new TypeError("Expected init to be a string");
    }

    // Remove leading "?" if exists
    // "?a=1&b=2" -> "a=1&b=2"
    if (init.startsWith("?")) {
      init = init.slice(1);
    }

    // Empty string -> nothing to parse
    if (!init) return;

    // Split by "&"
    // "a=1&b=2&a=3" -> ["a=1", "b=2", "a=3"]
    const pairs = init.split("&");

    for (const pair of pairs) {
      if (pair === "") continue;

      // Find "=" position
      // needed because value may contain "="
      const equalIndex = pair.indexOf("=");

      let key, value;

      // If "=" not found
      // example: "a"
      if (equalIndex === -1) {
        key = pair;
        value = "";
      } else {
        key = pair.slice(0, equalIndex);
        value = pair.slice(equalIndex + 1);
      }
      key = decodeURIComponent(key)
      value = decodeURIComponent(value)

      // Decode encoded characters
      // + -> space
      // %20 -> space
      this.params.push([
        key,
        value,
      ]);
    }
  }

  /**
   * append(name, value)
   *
   * Adds new key/value pair
   * Does NOT remove old ones
   *
   * a=1
   * append(a,2)
   * -> a=1&a=2
   */
  append(name, value) {
    this.params.push([String(name), String(value)]);
  }

  /**
   * delete(name)
   *
   * Remove ALL pairs with this key
   */
  delete(name) {
    name = String(name);

    this.params = this.params.filter(
      ([key]) => key !== name
    );
  }

  /**
   * entries()
   *
   * Returns iterator of [key, value]
   *
   * Needed for:
   * for (const [k,v] of params)
   */
  *entries() {
    for (const [key, value] of this.params) {
      yield [key, value];
    }
  }

  /**
   * forEach(callback)
   *
   * callback(value, key)
   * same order as URLSearchParams
   */
  forEach(callback) {
    for (const [key, value] of this.params) {
      callback(value, key);
    }
  }

  /**
   * get(name)
   *
   * Return FIRST value
   * or null if not found
   */
  get(name) {
    name = String(name);

    for (const [key, value] of this.params) {
      if (key === name) return value;
    }

    return null;
  }

  /**
   * getAll(name)
   *
   * Return ALL values
   */
  getAll(name) {
    name = String(name);

    const result = [];

    for (const [key, value] of this.params) {
      if (key === name) {
        result.push(value);
      }
    }

    return result;
  }

  /**
   * has(name)
   *
   * true if exists
   */
  has(name) {
    name = String(name);

    return this.params.some(
      ([key]) => key === name
    );
  }

  /**
   * keys()
   *
   * iterator of keys
   */
  *keys() {
    for (const [key] of this.params) {
      yield key;
    }
  }

  /**
   * set(name, value)
   *
   * Replace all existing values with one
   *
   * a=1&a=2
   * set(a,10)
   * -> a=10
   */
  set(name, value) {
    name = String(name);
    value = String(value);

    let found = false;

    const next = [];

    for (const [key, val] of this.params) {
      if (key === name) {
        // only keep first occurrence
        if (!found) {
          next.push([name, value]);
          found = true;
        }
      } else {
        next.push([key, val]);
      }
    }
    

    // if not found, append
    if (!found) {
      next.push([name, value]);
    }

    this.params = next;
  }

  /**
   * sort()
   *
   * sort by key alphabetically
   */
  sort() {
    this.params.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
  }

  /**
   * toString()
   *
   * Convert back to query string
   *
   * [
   *  ["a","1"],
   *  ["b","2"]
   * ]
   *
   * -> "a=1&b=2"
   */
  toString() {
    return this.params
      .map(([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  /**
   * values()
   *
   * iterator of values
   */
  *values() {
    for (const [, value] of this.params) {
      yield value;
    }
  }

  /**
   * Make class iterable
   *
   * for (const [k,v] of params)
   */
  [Symbol.iterator]() {
    return this.entries();
  }
}