/**
 * Problem:
 * We are given an `isBad(version)` API.
 *
 * Versions are ordered from 1 to n.
 * Once a version becomes bad, all versions after it are also bad.
 *
 * We need to return a function that, given `version = n`,
 * finds the FIRST bad version in range [1, n].
 *
 * If no bad version exists, return -1.
 *
 * Example:
 * versions: 1 2 3 4 5
 * status:   G G B B B
 * answer: 3
 *
 * We use Binary Search because:
 * - if mid is bad, first bad is at mid or on the left side
 * - if mid is good, first bad must be on the right side
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */

/**
 * @typedef {(version: number) => boolean} IsBad
 */

/**
 * @param {IsBad} isBad
 * @return {(v: number) => number}
 */
function firstBadVersion(isBad) {
  // firstBadVersion receives a checking function `isBad`
  // and returns a new function that will search from 1 to version
  return (version) => {
    // Start binary search between 1 and version
    let left = 1;
    let right = version;

    // This will store the first bad version we have found so far.
    // If we never find any bad version, it stays -1.
    let answer = -1;

    // Standard binary search loop
    while (left <= right) {
      // Safer way to calculate middle
      // avoids overflow in some languages
      const mid = left + Math.floor((right - left) / 2);

      // Check whether current mid version is bad
      if (isBad(mid)) {
        // mid is bad, so this could be the first bad version
        answer = mid;

        // But maybe there is an earlier bad version
        // so continue searching on the LEFT side
        right = mid - 1;
      } else {
        // mid is good, so first bad version must be on the RIGHT side
        left = mid + 1;
      }
    }

    // If found, return first bad version
    // otherwise return -1
    return answer;
  };
}