/**
 * Finds the single number in an array where
 * every other number appears exactly twice.
 *
 * Uses the XOR (^) bitwise operator.
 *
 * @param {number[]} arr
 * @return {number}
 */
function findSingle(arr) {
  // Initialize result to 0
  // 0 is the identity value for XOR (x ^ 0 = x)
  let result = 0;

  // Iterate through each number in the array
  for (const num of arr) {
    /*
      XOR properties:
      - a ^ a = 0  (same numbers cancel each other)
      - a ^ 0 = a
      - XOR is commutative and associative

      Since all numbers appear twice except one,
      every pair will cancel out, leaving only
      the unique number in 'result'.
    */
    result ^= num;
  }

  // After processing all elements,
  // 'result' contains the single number
  return result;
}

const arr = [10, 2, 2, 1, 0, 0, 10];
console.log(findSingle(arr)); // 1
