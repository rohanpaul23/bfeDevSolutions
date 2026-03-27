/**
 * Custom implementation of String.trim()
 *
 * Removes whitespace from the start and end of a string
 * without using built-in trim()
 *
 * Handles:
 * - spaces
 * - tabs
 * - new lines
 * - unicode whitespace (\u3000 etc)
 * - null / undefined safety
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) extra space
 */

function trim(str) {
  // Step 1: Handle null / undefined
  // Native trim throws TypeError for null / undefined
  if (str == null) {
    throw new TypeError("Cannot convert undefined or null to string");
  }

  // Step 2: Convert input to string
  // Because trim should work for numbers, booleans etc
  // Example: trim(123) -> "123"
  str = String(str);

  // Step 3: Initialize two pointers
  // start → from left
  // end → from right
  let start = 0;
  let end = str.length - 1;

  // Step 4: Move start pointer forward
  // while current character is whitespace
  //
  // /\s/ matches:
  // space, tab, newline, unicode space, etc
  while (start <= end && /\s/.test(str[start])) {
    start++;
  }

  // Step 5: Move end pointer backward
  // while current character is whitespace
  while (end >= start && /\s/.test(str[end])) {
    end--;
  }

  // Step 6: slice string between start and end
  //
  // slice(start, end + 1)
  // because slice end index is exclusive
  //
  // Example:
  // start = 3
  // end = 7
  // slice(3, 8)
  return str.slice(start, end + 1);
}