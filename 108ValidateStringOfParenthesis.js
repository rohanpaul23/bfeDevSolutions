/**
 * Checks whether the given string of brackets is valid.
 * Valid means:
 * 1. Every opening bracket has a corresponding closing bracket
 * 2. Brackets are closed in the correct order
 *
 * @param {string} str
 * @return {boolean}
 */
function validate(str) {
  // Stack to keep track of opening brackets
  const stack = [];

  // Map of closing brackets to their corresponding opening brackets
  // This helps us verify whether the latest opening bracket matches
  const map = new Map([
    [']', '['],
    ['}', '{'],
    [')', '(']
  ]);

  // Iterate through each character in the string
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    // If the character is a closing bracket
    if (map.has(ch)) {
      // Pop the last opening bracket from the stack
      const last = stack.pop();

      // If stack was empty OR brackets do not match, it's invalid
      if (last !== map.get(ch)) {
        return false;
      }
    } 
    // Otherwise, the character is an opening bracket
    else {
      // Push opening bracket onto the stack
      stack.push(ch);
    }
  }

  // If stack is empty, all brackets were matched correctly
  // If not empty, there are unmatched opening brackets
  return stack.length === 0;
}
