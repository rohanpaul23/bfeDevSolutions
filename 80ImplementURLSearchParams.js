class MyURLSearchParams {
  constructor(queryString = "") {
    // Internal map to store parameters
    // key -> array of values (to handle duplicate keys like ?a=1&a=2)
    this.map = new Map();

    // Remove leading '?' if present
    if (queryString.startsWith("?")) queryString = queryString.slice(1);

    // Parse the query string into key/value pairs
    if (queryString) {
      for (const pair of queryString.split("&")) {
        if (!pair) continue; // skip empty pairs (e.g., trailing '&')
        const [rawKey, rawValue = ""] = pair.split("=");

        // Decode percent-encoded characters (e.g., '%20' → ' ')
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent(rawValue);

        // Store into map (append handles duplicate keys)
        this.append(key, value);
      }
    }
  }

  // Add a new key/value pair
  // If key already exists, the value is added to its array (does not overwrite)
  append(key, value) {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push(String(value));
  }

  // Return the first value associated with a key, or null if not present
  get(key) {
    const values = this.map.get(key);
    return values ? values[0] : null;
  }

  // Return all values associated with a key (array)
  getAll(key) {
    const values = this.map.get(key);
    return values ? [...values] : [];
  }

  // Check if a key exists
  has(key) {
    return this.map.has(key);
  }

  // Replace all existing values for a key with a new single value
  set(key, value) {
    this.map.set(key, [String(value)]);
  }

  // Remove a key and all of its values
  delete(key) {
    this.map.delete(key);
  }

  // Serialize all entries into a query string like 'a=1&b=2'
  toString() {
    const pairs = [];
    for (const [key, values] of this.map) {
      for (const v of values) {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      }
    }
    return pairs.join("&");
  }

  // ----------- Iteration APIs -----------

  // Return an iterator over [key, value] pairs (including duplicates)
  *entries() {
    for (const [key, values] of this.map) {
      for (const v of values) yield [key, v];
    }
  }

  // Return an iterator over keys (each key repeats for every value)
  *keys() {
    for (const [key, values] of this.map) {
      for (let i = 0; i < values.length; i++) yield key;
    }
  }

  // Return an iterator over values (in insertion order)
  *values() {
    for (const [, values] of this.map) {
      for (const v of values) yield v;
    }
  }

  // Execute a callback for each (value, key, this) triple
  // Matches the native URLSearchParams.forEach(callback, thisArg)
  forEach(callback, thisArg) {
    for (const [key, values] of this.map) {
      for (const v of values) {
        callback.call(thisArg, v, key, this);
      }
    }
  }

  // Make the object directly iterable with for...of
  // Example: for (const [key, value] of params) { ... }
  [Symbol.iterator]() {
    return this.entries();
  }

  // ----------- Sorting -----------

  /**
   * Sort all key/value pairs by key name in Unicode order.
   * The sort is stable — if two entries have the same key,
   * their original order relative to each other is preserved.
   */
  sort() {
    // Flatten current entries with their original index for stable sorting
    const flat = [];
    let idx = 0;
    for (const [key, values] of this.map) {
      for (const v of values) {
        flat.push({ key, value: v, idx: idx++ });
      }
    }

    // Sort by key (lexicographically), keeping original order for ties
    flat.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return a.idx - b.idx; // maintain stability
    });

    // Rebuild the internal map from sorted data
    this.map = new Map();
    for (const { key, value } of flat) {
      if (!this.map.has(key)) this.map.set(key, []);
      this.map.get(key).push(value);
    }
  }
}
