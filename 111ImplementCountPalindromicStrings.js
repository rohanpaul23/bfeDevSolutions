function countPalindromicSubstrings(s) {
  let count = 0;

  /**
   * Expands around the given left and right indices.
   * Every time s[left] === s[right], the substring s[left..right]
   * is a valid palindrome.
   */
  const expand = (left, right) => {
    // Keep expanding as long as:
    // 1. left index stays within bounds
    // 2. right index stays within bounds
    // 3. characters on both sides match
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      // Each successful expansion represents
      // one palindromic substring
      count++;

      // Expand outward
      left--;
      right++;
    }
  };

  // Try every possible center in the string
  for (let i = 0; i < s.length; i++) {

    /**
     * ODD-LENGTH PALINDROMES
     * ---------------------
     * Center is a single character.
     * Examples: "a", "aba", "madam"
     *
     * We start with left === right === i
     * and expand outward.
     */
    expand(i, i);

    /**
     * EVEN-LENGTH PALINDROMES
     * ----------------------
     * Center is between two characters.
     * Examples: "aa", "abba", "noon"
     *
     * We start with left === i and right === i + 1
     * and expand outward.
     */
    expand(i, i + 1);
  }

  return count;
}
