/**
 * OriginData describes the data stored per origin.
 *
 * @typedef {object} OriginData
 * @property {string} origin        // unique key (e.g. 'a', 'b', 'c')
 * @property {number} lastUsed      // timestamp of last access/update
 * @property {number} size          // size occupied by this origin
 * @property {boolean} persistent   // whether this origin can be evicted
 */

class MyLRUStorage {
  /**
   * @param {number} capacity              // max total size allowed
   * @param {() => number} getTimestamp    // function returning current time
   */
  constructor(capacity, getTimestamp) {
    this.capacity = capacity;             // store total capacity
    this.getTimestamp = getTimestamp;     // store timestamp generator

    // Map preserves insertion order:
    //   first entry  -> Least Recently Used (LRU)
    //   last entry   -> Most Recently Used (MRU)
    this.store = new Map();

    // Tracks the sum of all stored sizes
    this.totalSize = 0;
  }

  /**
   * Marks an origin as recently used.
   * Achieved by deleting and re-inserting it into the Map.
   *
   * @param {string} origin
   * @param {OriginData} data
   */
  _touch(origin, data) {
    // Remove the key from its current position
    this.store.delete(origin);

    // Reinsert it so it becomes the most recently used (MRU)
    this.store.set(origin, data);
  }

  /**
   * Retrieve data for an origin.
   * Updates lastUsed timestamp and LRU order.
   *
   * @param {string} origin
   * @returns {OriginData | undefined}
   */
  getData(origin) {
    // Fetch data from the map
    const data = this.store.get(origin);

    // If origin does not exist, return undefined
    if (!data) return undefined;

    // Update last-used timestamp because it was accessed
    data.lastUsed = this.getTimestamp();

    // Move this origin to MRU position
    this._touch(origin, data);

    // Return the stored data
    return data;
  }

  /**
   * Evicts least-recently-used non-persistent origins
   * until totalSize <= capacity.
   *
   * The origin being set is excluded from eviction.
   *
   * @param {string} excludeOrigin
   */
  _evictIfNeeded(excludeOrigin) {
    // Iterate in insertion order: LRU -> MRU
    for (const [origin, data] of this.store) {
      // Stop once we're within capacity
      if (this.totalSize <= this.capacity) break;

      // Do not evict the origin currently being set
      if (origin === excludeOrigin) continue;

      // Persistent data cannot be auto-evicted
      if (data.persistent) continue;

      // Evict this origin
      this.store.delete(origin);

      // Reduce total size
      this.totalSize -= data.size;
    }
  }

  /**
   * Add or update data for an origin.
   *
   * @param {string} origin
   * @param {number} size
   * @returns {boolean}   // success or failure
   */
  setData(origin, size) {
    // -------------------------------
    // SNAPSHOT for rollback
    // -------------------------------

    // Deep-copy the Map so mutations can be reverted
    const snapshotStore = new Map(
      [...this.store].map(([k, v]) => [k, { ...v }])
    );

    // Save total size for rollback
    const snapshotTotal = this.totalSize;

    // Check if this origin already exists
    const existed = this.store.has(origin);

    // Capture current timestamp
    const now = this.getTimestamp();

    // -------------------------------
    // INSERT or UPDATE
    // -------------------------------
    if (!existed) {
      // Create new origin data
      const data = {
        origin,
        lastUsed: now,
        size,
        persistent: false,   // default: non-persistent
      };

      // Insert as MRU
      this.store.set(origin, data);

      // Increase total size
      this.totalSize += size;
    } else {
      // Fetch existing data
      const data = this.store.get(origin);

      // Compute size difference
      const delta = size - data.size;

      // Update size and timestamp
      data.size = size;
      data.lastUsed = now;

      // Adjust total size
      this.totalSize += delta;

      // Updating counts as usage → move to MRU
      this._touch(origin, data);
    }

    // If still within capacity, operation succeeds
    if (this.totalSize <= this.capacity) return true;

    // -------------------------------
    // EVICTION PHASE
    // -------------------------------
    this._evictIfNeeded(origin);

    // If we still exceed capacity, rollback everything
    if (this.totalSize > this.capacity) {
      this.store = snapshotStore;     // restore previous Map
      this.totalSize = snapshotTotal; // restore previous size
      return false;
    }

    // Eviction succeeded
    return true;
  }

  /**
   * Remove data for an origin manually.
   *
   * @param {string} origin
   */
  clearData(origin) {
    // Fetch data
    const data = this.store.get(origin);

    // If not present, nothing to do
    if (!data) return;

    // Remove from Map
    this.store.delete(origin);

    // Update total size
    this.totalSize -= data.size;
  }

  /**
   * Mark an existing origin as persistent.
   * Persistent data cannot be evicted automatically.
   *
   * @param {string} origin
   */
  makePersistent(origin) {
    // Fetch data
    const data = this.store.get(origin);

    // If origin does not exist, do nothing
    if (!data) return;

    // Mark as persistent
    data.persistent = true;
  }
}
