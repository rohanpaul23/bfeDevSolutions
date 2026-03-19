/**
 * ============================================================
 * createGetAPIWithMerging
 * ============================================================
 *
 * We wrap the original getAPI so that:
 *
 * 1. If multiple calls are made with the same (path, config)
 *    while the request is still in-flight,
 *    we only call getAPI once and return the same Promise.
 *
 * 2. Config objects may have different key order,
 *    but should be considered equal if they have same content.
 *
 * 3. Cache should not grow forever.
 *    At most 5 entries should exist at the same time.
 *
 * 4. When a request finishes, it should be removed from cache.
 *
 * 5. Returned function must also have clearCache().
 *
 * ------------------------------------------------------------
 *
 * Key idea:
 *
 * cache: Map<key, Promise>
 *
 * key = path + stableStringify(config)
 *
 * stableStringify ensures:
 *   {a:1, b:2} === {b:2, a:1}
 *
 * ------------------------------------------------------------
 *
 * @param {(path: string, config: any) => Promise<any>} getAPI
 * @returns {(path: string, config: any) => Promise<any> & {clearCache: () => void}}
 */
function createGetAPIWithMerging(getAPI) {

  // ----------------------------------------------------------
  // Map used as cache:
  // key -> Promise
  //
  // We store only in-flight requests here.
  // Map preserves insertion order, useful for eviction.
  // ----------------------------------------------------------
  const cache = new Map();

  // Max allowed cache entries
  const MAX_CACHE_SIZE = 5;


  /**
   * ----------------------------------------------------------
   * stableStringify
   * ----------------------------------------------------------
   *
   * JSON.stringify is NOT enough because:
   *
   * JSON.stringify({a:1, b:2})
   * JSON.stringify({b:2, a:1})
   *
   * are different strings.
   *
   * We must sort object keys so logically equal objects
   * produce the same string.
   *
   * Rules:
   * - primitive -> JSON.stringify
   * - array -> keep order
   * - object -> sort keys
   *
   * ----------------------------------------------------------
   */
  function stableStringify(value) {

    // If primitive or null, just stringify normally
    if (value === null || typeof value !== "object") {
      return JSON.stringify(value);
    }

    // If array, keep order
    if (Array.isArray(value)) {
      return "[" + value.map(stableStringify).join(",") + "]";
    }

    // If object, sort keys
    const keys = Object.keys(value).sort();

    const parts = keys.map(key => {
      return JSON.stringify(key) + ":" + stableStringify(value[key]);
    });

    return "{" + parts.join(",") + "}";
  }


  /**
   * ----------------------------------------------------------
   * buildKey
   * ----------------------------------------------------------
   *
   * Build unique cache key using:
   *   path + stable config string
   *
   * Example:
   *
   * "/list" + {"a":1,"b":2}
   *
   * ----------------------------------------------------------
   */
  function buildKey(path, config) {
    return path + "|" + stableStringify(config);
  }


  /**
   * ----------------------------------------------------------
   * getAPIWithMerging
   * ----------------------------------------------------------
   *
   * This is the function we return.
   *
   * It wraps getAPI and adds:
   *
   * - request merging
   * - cache limit
   * - cache cleanup
   *
   * ----------------------------------------------------------
   */
  function getAPIWithMerging(path, config) {

    // Build unique key
    const key = buildKey(path, config);


    // --------------------------------------------------------
    // 1. If request already in cache → return same promise
    // --------------------------------------------------------
    if (cache.has(key)) {
      return cache.get(key);
    }


    // --------------------------------------------------------
    // 2. Ensure cache does not exceed 5 entries
    //
    // If cache full, remove oldest entry
    //
    // Map keeps insertion order:
    // cache.keys().next().value = oldest key
    // --------------------------------------------------------
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }


    // --------------------------------------------------------
    // 3. Call original API
    // --------------------------------------------------------
    const promise = getAPI(path, config)
      .finally(() => {

        // --------------------------------------------
        // Remove from cache when finished
        //
        // Important:
        // Only delete if the same promise is still stored.
        //
        // Prevents deleting a newer request accidentally.
        // --------------------------------------------
        if (cache.get(key) === promise) {
          cache.delete(key);
        }

      });


    // Store promise in cache
    cache.set(key, promise);


    // Return promise
    return promise;
  }


  /**
   * ----------------------------------------------------------
   * clearCache
   * ----------------------------------------------------------
   *
   * Required by problem.
   *
   * Removes all cached in-flight requests.
   *
   * ----------------------------------------------------------
   */
  getAPIWithMerging.clearCache = function () {
    cache.clear();
  };


  // Return wrapped function
  return getAPIWithMerging;
}