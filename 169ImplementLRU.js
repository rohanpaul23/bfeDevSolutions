// This is a JavaScript coding problem from BFE.dev 

/**
 * @typedef {object} OriginData
 * @property {string} origin
 * @property {number} lastUsed
 * @property {number} size
 * @property {boolean} persistent
 */

class MyLRUStorage  {
  /**
   * @param {number} capacity
   * @param {() => number} getTimestamp
   */
  constructor(capacity, getTimestamp) {
    this.capacity = capacity;
    this.getTimestamp = getTimestamp;

    // origin -> OriginData
    this.storage = new Map();

    // total used storage
    this.used = 0;
  }

  /**
   * Return data for the given origin, and mark it as recently used.
   *
   * Time: O(1)
   * Space: O(1)
   *
   * @param {string} origin
   * @returns {OriginData | undefined}
   */
  getData(origin) {
    if (!this.storage.has(origin)) {
      return undefined;
    }

    const data = this.storage.get(origin);

    // Access updates recency
    data.lastUsed = this.getTimestamp();

    return data;
  }

  /**
   * Insert or update an origin with the given size.
   *
   * Rules:
   * - If size itself is bigger than total capacity, impossible -> false
   * - If origin already exists, we update its size and refresh lastUsed
   * - If total used would exceed capacity, evict LRU non-persistent items
   * - Persistent items cannot be evicted
   *
   * Time: O(n^2) worst case with repeated scans for eviction
   *       (fine for interview / BFE style unless optimized with heap/list)
   * Space: O(1) extra, ignoring stored data
   *
   * @param {string} origin
   * @param {number} size
   * @returns {boolean}
   */
  setData(origin, size) {
    // If one item alone cannot fit, fail immediately
    if (size > this.capacity) {
      return false;
    }

    const now = this.getTimestamp();

    // Case 1: updating existing origin
    if (this.storage.has(origin)) {
      const data = this.storage.get(origin);

      // Temporarily remove old size from used
      this.used -= data.size;

      const oldSize = data.size;
      data.size = size;
      data.lastUsed = now;

      // If it fits now, done
      if (this.used + size <= this.capacity) {
        this.used += size;
        return true;
      }

      // Need eviction, but never evict persistent entries
      // Also never evict the same origin we are currently updating
      while (this.used + size > this.capacity) {
        const victim = this.#findLRUNonPersistent(origin);

        if (!victim) {
          // rollback if impossible
          data.size = oldSize;
          this.used += oldSize;
          return false;
        }

        this.storage.delete(victim.origin);
        this.used -= victim.size;
      }

      this.used += size;
      return true;
    }

    // Case 2: inserting new origin
    while (this.used + size > this.capacity) {
      const victim = this.#findLRUNonPersistent();

      if (!victim) {
        return false;
      }

      this.storage.delete(victim.origin);
      this.used -= victim.size;
    }

    this.storage.set(origin, {
      origin,
      lastUsed: now,
      size,
      persistent: false,
    });

    this.used += size;
    return true;
  }

  /**
   * Remove data for an origin if present.
   *
   * Time: O(1)
   * Space: O(1)
   *
   * @param {string} origin
   * @returns {void}
   */
  clearData(origin) {
    if (!this.storage.has(origin)) {
      return;
    }

    const data = this.storage.get(origin);
    this.used -= data.size;
    this.storage.delete(origin);
  }

  /**
   * Mark an existing origin as persistent.
   *
   * If origin doesn't exist, do nothing.
   *
   * Time: O(1)
   * Space: O(1)
   *
   * @param {string} origin
   * @returns {void}
   */
  makePersistent(origin) {
    if (!this.storage.has(origin)) {
      return;
    }

    const data = this.storage.get(origin);
    data.persistent = true;
  }

  /**
   * Find the least recently used non-persistent origin.
   *
   * excludeOrigin is used when updating an existing entry:
   * we should not evict the same item we are currently resizing.
   *
   * Time: O(n)
   *
   * @param {string=} excludeOrigin
   * @returns {OriginData | undefined}
   */
  #findLRUNonPersistent(excludeOrigin) {
    let victim = undefined;

    for (const data of this.storage.values()) {
      if (data.persistent) continue;
      if (data.origin === excludeOrigin) continue;

      if (!victim || data.lastUsed < victim.lastUsed) {
        victim = data;
      }
    }

    return victim;
  }
}