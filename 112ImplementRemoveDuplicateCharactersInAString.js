function smallestUniqueSubstr(str) {
  // Map to store the LAST index at which each character appears
  // This helps us decide whether it is safe to remove (pop) a character
  // from the stack and add it again later.
  let occurenceMap = new Map();

  // Stack will store characters of the final result
  // in the order they appear in the smallest lexicographical subsequence
  let stack = [];

  // Set to track which characters are already present in the stack
  // Prevents duplicates in the result
  let visited = new Set();

  // Step 1: Record the last occurrence index of each character
  for (let i = 0; i < str.length; i++) {
    occurenceMap.set(str[i], i);
  }

  // Step 2: Iterate through the string to build the result
  for (let i = 0; i < str.length; i++) {
    let ch = str[i];

    // If character is already included in the result, skip it
    if (visited.has(ch)) {
      continue;
    }

    /**
     * Greedy removal:
     * While:
     * 1) stack is not empty
     * 2) top of stack is lexicographically greater than current character
     * 3) top character appears again later (safe to remove now)
     *
     * Pop it to get a smaller lexicographical order.
     */
    while (
      stack.length > 0 &&
      stack[stack.length - 1] > ch &&
      occurenceMap.get(stack[stack.length - 1]) > i
    ) {
      // Remove the character from stack
      // and mark it as not visited so it can be added again later
      visited.delete(stack.pop());
    }

    // Add current character to stack and mark it as visited
    stack.push(ch);
    visited.add(ch);
  }

  // Stack now contains the smallest lexicographical
  // subsequence with all unique characters
  return stack.join("");
}

console.log(smallestUniqueSubstr("xyzabcxyzabc")); // "abcxyz"
