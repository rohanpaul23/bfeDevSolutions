function longestUniqueSubstr(str) {
  // `left` represents the starting index of the current sliding window
  let left = 0;

  // `seen` stores the characters currently inside the window
  // This window always contains unique characters
  let seen = [];

  // Length of the longest unique-character substring found so far
  let maxLen = 0;

  // Starting index of the longest valid substring
  let start = 0;

  // `right` expands the window character by character
  for (let right = 0; right < str.length; right++) {

    // If the current character already exists in the window,
    // we need to shrink the window from the left until
    // that duplicate character is removed
    while (seen.includes(str[right])) {
      // Remove the leftmost character from the window
      seen.shift();

      // Move the left pointer forward
      left++;
    }

    // Add the current character to the window
    seen.push(str[right]);

    // If the current window size is the largest so far,
    // update maxLen and record the start index
    if (seen.length > maxLen) {
      maxLen = seen.length;
      start = left;
    }
  }

  // Extract and return the longest substring using start index and length
  return str.slice(start, start + maxLen);
}
