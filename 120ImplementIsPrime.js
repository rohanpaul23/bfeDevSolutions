/**
 * Checks whether a number is prime.
 * A prime number is greater than 1 and divisible only by 1 and itself.
 *
 * @param {number} n
 * @return {boolean}
 */
function isPrime(n) {
  // Numbers less than or equal to 1 are NOT prime
  // (0, 1, and negative numbers have more or fewer than two divisors)
  if (n <= 1) return false;

  // Loop through all numbers from 2 up to n - 1
  // If any number divides n evenly, n is not prime
  for (let i = 2; i < n; i++) {
    // Check if i divides n without a remainder
    if (n % i === 0) {
      // Found a divisor other than 1 and n itself
      // Therefore, n is NOT prime
      return false;
    }
  }

  // If no divisors were found, n is prime
  return true;
}
